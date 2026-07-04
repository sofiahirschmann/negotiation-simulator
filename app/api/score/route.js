import Anthropic from "@anthropic-ai/sdk";
import { getPersona } from "@/lib/personas";
import { getStorefront } from "@/lib/storefront";
import { TACTICS, rubricText } from "@/lib/tactics";

export const maxDuration = 60;

// Lazy init so the build doesn't require ANTHROPIC_API_KEY.
let client;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

// Score = tactic points (judge-graded, max 72) + outcome points (computed
// server-side from distance to the hidden floor, max 28). The judge is never
// told the floor, so its feedback text cannot leak it.
const GRADE_POINTS = { sharp: 18, decent: 12, weak: 6, missed: 0 };
const OUTCOME_MAX = 28;
const NO_DEAL_POINTS = 8;

const MARKER_RE = /⟦ask:(\d+)\|status:(open|deal|walkaway)⟧/g;

const JUDGE_SCHEMA = {
  type: "object",
  properties: {
    tactics: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", enum: TACTICS.map((t) => t.id) },
          used: { type: "boolean" },
          grade: { type: "string", enum: ["sharp", "decent", "weak", "missed"] },
          feedback: { type: "string" },
        },
        required: ["id", "used", "grade", "feedback"],
        additionalProperties: false,
      },
    },
    summary: { type: "string" },
    bestMove: { type: "string" },
    worstMove: { type: "string" },
  },
  required: ["tactics", "summary", "bestMove", "worstMove"],
  additionalProperties: false,
};

function deriveOutcome(messages, clientOutcome) {
  // Server-authoritative: read the vendor's own state markers rather than
  // trusting numbers the client sends.
  let lastAsk = null;
  let lastStatus = "open";
  for (const m of messages) {
    if (m.role !== "assistant") continue;
    for (const match of m.content.matchAll(MARKER_RE)) {
      lastAsk = parseInt(match[1], 10);
      lastStatus = match[2];
    }
  }
  let status = lastStatus;
  if (status === "open" && clientOutcome?.status === "player-walked") {
    status = "player-walked";
  }
  return { status, finalPrice: lastAsk };
}

function outcomeBand(persona, vendor, outcome) {
  if (outcome.status !== "deal" || outcome.finalPrice == null) {
    const walked = outcome.status === "player-walked";
    return {
      band: "No deal",
      bandNote: walked
        ? "You walked. Sometimes that's the right call. The judge weighs whether it was."
        : "The vendor ended it. You pushed past the point of no return.",
      points: NO_DEAL_POINTS,
    };
  }
  const room = persona.openingPrice - persona.floorPrice;
  const captured = (persona.openingPrice - outcome.finalPrice) / room;
  const pos = Math.max(0, Math.min(1, captured));
  const points = Math.round(pos * OUTCOME_MAX);
  if (pos >= 0.85)
    return { band: "A steal", bandNote: "You squeezed nearly everything there was to squeeze.", points };
  if (pos >= 0.55)
    return { band: "Solid deal", bandNote: "A price the vendor genuinely didn't want to say yes to.", points };
  if (pos >= 0.25)
    return { band: "Money on the table", bandNote: "You got a discount. There was more to be had.", points };
  return { band: "Fleeced", bandNote: "The vendor is telling this story at dinner tonight.", points };
}

function buildJudgePrompt(vendor, messages, outcome) {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "BUYER" : "VENDOR"}: ${m.content}`)
    .join("\n\n");
  return `Analyze this price negotiation and grade the BUYER's tactics. You are grading the buyer only; the vendor is a fixed AI character.

CONTEXT
- Item: ${vendor.item} (${vendor.role.toLowerCase()}: ${vendor.name})
- Vendor's opening ask: ${vendor.openingPrice}
- How it ended: ${outcome.status}${outcome.finalPrice != null ? ` at ${outcome.finalPrice}` : ""}
- Lines like ⟦ask:N|status:S⟧ are machine state markers showing the vendor's asking price after each reply. Use them to track price movement; the buyer never saw them.

RUBRIC. Grade each of these four tactics:
${rubricText()}

For each tactic report: whether the buyer used it at all ("used"), a grade of "sharp" (textbook execution), "decent" (used it, imperfectly), "weak" (a half-hearted attempt), or "missed" (never tried, or tried and it backfired), and one line of specific, concrete feedback quoting or referencing what the buyer actually said. Feedback should read like a sharp coach: direct, specific, no filler. Never use em dashes in any text you write; use commas, periods, or colons instead. Also give a one-line overall summary, the buyer's single best move, and their single worst move (or biggest omission).

TRANSCRIPT
${transcript}`;
}

async function callJudge(prompt, strict) {
  const response = await getClient().messages.create({
    model: "claude-opus-4-8",
    max_tokens: 8192,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: { type: "json_schema", schema: JUDGE_SCHEMA },
    },
    system:
      "You are a cold, precise negotiation analyst. No persona, no warmth, no hedging. Grade only what is in the transcript." +
      (strict ? " Respond with ONLY the JSON object. No prose, no code fences." : ""),
    messages: [{ role: "user", content: prompt }],
  });
  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  // Structured outputs should guarantee clean JSON, but parse defensively:
  // strip fences if any model ever wraps them on.
  const stripped = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(stripped);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { personaId, messages, outcome: clientOutcome } = body || {};
  const persona = getPersona(personaId);
  const vendor = getStorefront(personaId);
  if (!persona || !vendor) {
    return Response.json({ error: "Unknown vendor." }, { status: 400 });
  }
  if (
    !Array.isArray(messages) ||
    messages.length < 2 ||
    messages.length > 60 ||
    !messages.every(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
  ) {
    return Response.json({ error: "Bad transcript." }, { status: 400 });
  }

  const outcome = deriveOutcome(messages, clientOutcome);
  const { band, bandNote, points: outcomePoints } = outcomeBand(persona, vendor, outcome);
  const prompt = buildJudgePrompt(vendor, messages, outcome);

  let verdict;
  try {
    verdict = await callJudge(prompt, false);
  } catch (err) {
    console.error("judge parse/call failed, retrying once:", err?.message);
    try {
      verdict = await callJudge(prompt, true);
    } catch (err2) {
      console.error("judge retry failed:", err2?.message);
      return Response.json(
        { error: "The judge choked on this one. Try scoring again." },
        { status: 502 }
      );
    }
  }

  // Keep only rubric tactics, in rubric order; fill any the judge skipped.
  const byId = new Map((verdict.tactics || []).map((t) => [t.id, t]));
  const tactics = TACTICS.map((t) => {
    const v = byId.get(t.id);
    return v
      ? { id: t.id, used: !!v.used, grade: v.grade, feedback: v.feedback }
      : { id: t.id, used: false, grade: "missed", feedback: "Not attempted." };
  });

  const tacticPoints = tactics.reduce(
    (sum, t) => sum + (GRADE_POINTS[t.grade] ?? 0),
    0
  );
  const score = Math.max(0, Math.min(100, tacticPoints + outcomePoints));

  return Response.json({
    score,
    outcome: { status: outcome.status, finalPrice: outcome.finalPrice, band, bandNote },
    tactics,
    summary: verdict.summary,
    bestMove: verdict.bestMove,
    worstMove: verdict.worstMove,
  });
}

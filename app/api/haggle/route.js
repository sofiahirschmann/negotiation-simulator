import Anthropic from "@anthropic-ai/sdk";
import { getPersona } from "@/lib/personas";

export const maxDuration = 60;

// Lazy init so the build doesn't require ANTHROPIC_API_KEY.
let client;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

const MAX_MESSAGES = 48; // hard cap on conversation length
const MAX_MESSAGE_CHARS = 1200;

// Past this many exchanges, tell the vendor to force a decision.
const ENDGAME_AFTER_MESSAGES = 22;
const ENDGAME_NUDGE = `
This haggle has gone on long enough. In this reply, give your single FINAL number and make clear it is final. If the buyer has already refused your final number, end it: status walkaway.`;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { personaId, messages } = body || {};
  const persona = getPersona(personaId);
  if (!persona) {
    return Response.json({ error: "Unknown vendor." }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Bad conversation state." }, { status: 400 });
  }
  const clean = [];
  for (const m of messages) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) {
      return Response.json({ error: "Bad conversation state." }, { status: 400 });
    }
    if (typeof m.content !== "string" || m.content.length === 0) {
      return Response.json({ error: "Bad conversation state." }, { status: 400 });
    }
    clean.push({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) });
  }
  if (clean[clean.length - 1].role !== "user") {
    return Response.json({ error: "Bad conversation state." }, { status: 400 });
  }

  let system = persona.systemPrompt;
  if (clean.length >= ENDGAME_AFTER_MESSAGES) {
    system += ENDGAME_NUDGE;
  }

  const stream = getClient().messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    output_config: { effort: "low" },
    system,
    messages: clean,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error("haggle stream error:", err?.status || "", err?.message);
        controller.error(err);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

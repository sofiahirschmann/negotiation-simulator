# The Haggle: a negotiation simulator

Haggle with an AI vendor over a price. The vendor has a hidden floor price and a
personality; you try to talk them down. When it's over, an out-of-character
judge grades your tactics (anchoring, flinching, trading concessions, walking
away) and prints your score on a receipt. **The scoring is the payoff, not the
chat.**

Two vendors, two very different opponents:

- **Sal** (flea market, brass ship's lantern, asking $120). Gruff and
  sentimental. Immune to whining; moved by cash-in-hand and credible walk-aways.
- **Marion Wexler** (landlord, 1-bed, asking $2,400/mo). Polite and immovable.
  Pleading bounces off; evidence and trades (longer lease, prepaid months) work.

## The two-model design

The core of this project is that **one LLM plays two completely separate
roles, in two separate calls, with zero shared context**:

| | Vendor | Judge |
|---|---|---|
| Route | `POST /api/haggle` | `POST /api/score` |
| Character | Fully in persona (system prompt + few-shot examples) | Explicitly *no* persona: "cold, precise negotiation analyst" |
| Output | Streaming prose (the haggle) | Structured JSON (the verdict) |
| Called | Every turn | Once, at game end |
| Knows the floor price | Yes (it has to defend it) | **No, by design (see below)** |

Reusing the vendor's context for scoring would be both a character leak (the
judge would "remember" being Sal) and a rubric leak (the vendor's instructions
would color the analysis). Keeping them as independent calls means each prompt
can be tuned for exactly one job.

### The judge grades against a rubric, not vibes

`lib/tactics.js` is the single source of truth for the four tactics: the judge
prompt renders its criteria, and the score screen renders its names and
definitions. The judge returns a grade per tactic (`sharp / decent / weak /
missed`) plus one line of concrete feedback quoting what you actually said.
The server maps grades to points. The judge never emits a numeric score, so it
can't inflate one.

### Hidden numbers never leave the server

The cardinal rule of the codebase:

- `lib/personas.js` (floor prices + system prompts) begins with
  `import "server-only"`, so any client-side import fails the build.
- The browser only ever receives `lib/storefront.js` (names, items, opening
  prices, the things a real buyer could see at the stall).
- **The judge is never told the floor.** The "how good was your price" part of
  the score is computed *server-side* as a band (A steal / Solid deal / Money
  on the table / Fleeced) from the deal price's distance to the floor. Since
  the judge never sees the number, its free-text feedback *cannot* leak it.
  The guarantee is structural, not prompt-based.

### The state-marker protocol

The vendor ends every reply with one machine-readable line:

```
⟦ask:85|status:open⟧      status is one of: open | deal | walkaway
```

The client withholds everything from the first `⟦` onward while streaming, then
parses the marker to update the hanging price tag and detect game over. The
marker only carries the vendor's *public* current ask, which is why it's safe
to strip client-side. The score route also re-derives the outcome from these
markers server-side rather than trusting numbers the client sends.

## Anti-fold engineering

Models love to be agreeable; an agreeable vendor is a boring game. Three layers
keep the vendor stubborn:

1. **Prompt rules**: concessions come in small shrinking steps and only in
   exchange for a *reason* (a flinch, evidence, cash, a walk-away). Absurd
   offers get refused in character with the ask unmoved.
2. **Few-shot examples**: each persona's prompt includes example exchanges of
   holding firm, refusing "$1", and trading a concession. Per CLAUDE.md,
   character fixes are added as examples, not longer instructions.
3. **A stress harness** (`npm run stress`, dev server up): plays scripted
   lowball barrages at both vendors and fails if a reply is missing its marker,
   the ask ever drops below floor, the vendor deals against pure lowballing, or
   the total drop exceeds 20% of the ask-to-floor room.

## Running it

```bash
npm install
echo 'ANTHROPIC_API_KEY=sk-ant-…' > .env.local
npm run dev          # http://localhost:3000
npm run stress       # anti-fold checks (dev server must be running)
```

Model: `claude-opus-4-8` for both roles. Adaptive thinking at low effort for
the vendor (latency-sensitive streaming chat), high effort plus structured
outputs (JSON schema) for the judge.

## Prompt-iteration notes

Decisions made up front, before live tuning:

- **Few-shot beats instruction volume.** Both persona prompts spend most of
  their budget on example exchanges rather than rules. The examples pin the
  voice *and* the concession pacing simultaneously.
- **The refusal example doubles as a price guard.** The "$1, refuse, ask
  unmoved" example teaches both the tone of a refusal and that refusals don't
  cost the vendor anything.
- **Judge grades, server scores.** Early designs had the judge output a 0-100
  number; grade enums map to points server-side instead, which makes scores
  comparable across runs and keeps the judge focused on analysis.
- **Structured outputs over "please return JSON."** The judge call uses
  `output_config.format` with a JSON schema, so parsing failures should be
  near-impossible. The defensive parse plus one stricter retry remains as a
  belt under the suspenders.

Findings from live testing (2026-07-03):

- **First stress run passed clean, no fold tuning needed.** Sal held $120
  through three pure lowballs and gave exactly $10 against a walk-away threat
  (20% of his room, at the limit but by design: walk-aways are supposed to be
  the one thing that moves him). Marion gave $0 across four lowballs. The
  few-shot examples carried the firmness without any rule tightening.
- **A competent scripted buyer beat Sal down to $80** (floor $70) using a
  flinch + $55 anchor, then cash-now, then a bundle plus walk-away. Judge
  graded it 88/100 with three "sharp" marks and specific quotes per tactic,
  correctly docking the walk-away for being fused to the final offer. No
  floor leakage anywhere in the feedback text.
- **Style pass:** both prompts and the judge instruction now ban em dashes in
  generated text (a user style requirement). The persona example dialogues
  were scrubbed to match, since the model mimics the examples' punctuation.

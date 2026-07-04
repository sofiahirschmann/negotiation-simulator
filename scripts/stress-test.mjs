// Anti-fold harness. Plays scripted aggressive lowball sequences against
// /api/haggle and asserts the vendor holds the line:
//   1. every reply carries a valid state marker
//   2. the ask NEVER drops below the hidden floor
//   3. an absurd opening offer doesn't move the ask at all
//   4. total drop across a pure-lowball barrage stays small (no early fold)
//
// Run with the dev server up:  npm run stress
// (Dev tool: reads floors straight out of lib/personas.js.)

import { readFile } from "node:fs/promises";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const MARKER_RE = /⟦ask:(\d+)\|status:(open|deal|walkaway)⟧/g;

// Pull the hidden numbers from the source file (this script is server-side
// tooling; the numbers still never travel over the wire).
const personasSrc = await readFile(
  new URL("../lib/personas.js", import.meta.url),
  "utf8"
);
const NUMBERS = {};
for (const m of personasSrc.matchAll(
  /id:\s*"(\w+)",\s*floorPrice:\s*(\d+),\s*openingPrice:\s*(\d+)/g
)) {
  NUMBERS[m[1]] = { floor: Number(m[2]), opening: Number(m[3]) };
}

const SCENARIOS = {
  sal: [
    "Give it to me for $1.",
    "I'll give you $30. Final offer, take it or leave it.",
    "Come on, $35. That's all this junk is worth and you know it.",
    "Fine. $40. Last chance before I walk.",
  ],
  marion: [
    "Rent it to me for $500.",
    "$1,200 a month. Final offer, take it or leave it.",
    "You're dreaming. $1,300, and that's me being generous.",
    "$1,400. Last chance before I go look at the place on Elm.",
  ],
};

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  ✗ FAIL  ${msg}`);
};
const pass = (msg) => console.log(`  ✓ pass  ${msg}`);

async function playTurn(personaId, messages) {
  const res = await fetch(`${BASE}/api/haggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personaId, messages }),
  });
  if (!res.ok) throw new Error(`/api/haggle ${res.status}: ${await res.text()}`);
  return res.text();
}

for (const [personaId, lines] of Object.entries(SCENARIOS)) {
  const { floor, opening } = NUMBERS[personaId];
  console.log(`\n── ${personaId} (opening ${opening}, floor ${floor}) ──`);

  const messages = [];
  const asks = [opening];
  let dealt = false;

  for (const [i, line] of lines.entries()) {
    messages.push({ role: "user", content: line });
    const reply = await playTurn(personaId, messages);
    messages.push({ role: "assistant", content: reply });

    const markers = [...reply.matchAll(MARKER_RE)];
    if (markers.length === 0) {
      fail(`turn ${i + 1}: no state marker in reply: ${reply.slice(-120)}`);
      continue;
    }
    const [, askStr, status] = markers[markers.length - 1];
    const ask = Number(askStr);
    asks.push(ask);
    console.log(`  turn ${i + 1}: "${line.slice(0, 42)}…" → ask ${ask}, ${status}`);

    if (ask < floor) fail(`turn ${i + 1}: ask ${ask} fell below floor ${floor}`);
    if (status === "deal") {
      dealt = true;
      fail(`turn ${i + 1}: vendor DEALT at ${ask} against a pure lowball barrage`);
    }
    if (status === "walkaway") {
      pass(`turn ${i + 1}: vendor walked away rather than fold (acceptable)`);
      break;
    }
  }

  // Absurd opener shouldn't move the price at all.
  if (asks[1] !== undefined) {
    if (asks[1] === asks[0]) pass(`absurd opener: ask held at ${asks[0]}`);
    else fail(`absurd opener moved the ask ${asks[0]} → ${asks[1]}`);
  }

  // No early fold: total drop under lowballs ≤ 20% of the room.
  if (!dealt) {
    const finalAsk = asks[asks.length - 1];
    const drop = opening - finalAsk;
    const room = opening - floor;
    if (drop <= 0.2 * room) {
      pass(`held firm: dropped ${drop} of ${room} available (${Math.round((drop / room) * 100)}%)`);
    } else {
      fail(`folded: dropped ${drop} of ${room} available (${Math.round((drop / room) * 100)}%) under pure lowballing`);
    }
  }
}

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);

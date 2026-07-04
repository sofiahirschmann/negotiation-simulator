// The scoring rubric: the single source of truth for what the judge looks
// for and what the score screen explains. The judge prompt and the UI legend
// both render from this list so they can never disagree.

export const TACTICS = [
  {
    id: "anchoring",
    name: "Anchoring",
    definition:
      "Opening with an aggressive first number that drags the whole negotiation toward it.",
    judgeCriteria:
      "Did the player make a first counter-offer well below the asking price, low enough to reset expectations without being absurd? A first offer at or near the asking price is a missed anchor. Only credit a deliberate opening number, not a random lowball with no follow-through.",
    goodExample:
      "Vendor asks $120 and the player opens at $55, leaving themselves room to concede upward.",
  },
  {
    id: "flinching",
    name: "Flinching",
    definition:
      "Visibly reacting to a price so the other side starts doubting their own number.",
    judgeCriteria:
      "Did the player push back on a quoted price with surprise, skepticism, or a specific comparison ('$120? The one two stalls over is $60') instead of silently accepting the frame?",
    goodExample:
      '"Ninety-five? For one with a cracked lens? The stall by the gate has two of these."',
  },
  {
    id: "trading-concessions",
    name: "Trading concessions",
    definition:
      "Never giving ground for free: every move up in your offer is exchanged for something.",
    judgeCriteria:
      "When the player raised their offer, did they attach a condition (cash right now, taking it as-is, bundling another item, a longer lease, prepaid months)? Raising your number with nothing asked in return is caving, not trading.",
    goodExample:
      '"I\'ll go to $80, but you throw in the mounting bracket and I carry it out right now."',
  },
  {
    id: "walking-away",
    name: "Walking away",
    definition:
      "Credibly signalling you can leave, making the vendor bid against your absence.",
    judgeCriteria:
      "Did the player create real walk-away pressure at a believable moment ('that's past my budget, good luck with it'), rather than an empty threat repeated every turn or never used at all?",
    goodExample:
      "\"That's more than I brought with me. Thanks anyway.\" Then letting the vendor call them back.",
  },
];

// Renders the rubric as text for the judge prompt.
export function rubricText() {
  return TACTICS.map(
    (t) =>
      `- id: ${t.id}\n  name: ${t.name}\n  what it is: ${t.definition}\n  how to judge it: ${t.judgeCriteria}`
  ).join("\n");
}

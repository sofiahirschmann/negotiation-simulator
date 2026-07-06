// Public vendor info only. Everything here is safe to ship to the browser.
// Hidden numbers (floor prices) live in lib/personas.js, which is server-only.

export const STOREFRONT = [
  {
    id: "sal",
    name: "Sal",
    role: "Flea-market seller",
    item: "Brass ship's lantern",
    unit: "",
    openingPrice: 120,
    tagline: "Gruff. Sentimental. Insulted by lowballs.",
    hint: "Cash today talks. So does walking.",
    difficulty: "Rowdy",
    accent: "#f0a836", // lantern amber
    caption:
      "You're at the stall. The asking price is on the tag. Open your mouth. Better yet, open low.",
  },
  {
    id: "marion",
    name: "Marion Wexler",
    role: "Landlord",
    item: "Sunny 1-bedroom, Maple St.",
    unit: "/mo",
    openingPrice: 2400,
    tagline: "Polite. Immovable. Loves the phrase “market rate.”",
    hint: "Pleading bounces off. Evidence doesn't.",
    difficulty: "Ice-cold",
    accent: "#79c2a3", // money mint
    caption:
      "You're on the stoop. The rent is on the tag. Say something. Aim lower than feels polite.",
  },
];

export function getStorefront(id) {
  return STOREFRONT.find((v) => v.id === id) || null;
}

export function formatPrice(vendor, n) {
  return `$${Number(n).toLocaleString("en-US")}${vendor?.unit || ""}`;
}

// Public vendor info only — everything here is safe to ship to the browser.
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
  },
];

export function getStorefront(id) {
  return STOREFRONT.find((v) => v.id === id) || null;
}

export function formatPrice(vendor, n) {
  return `$${Number(n).toLocaleString("en-US")}${vendor?.unit || ""}`;
}

import { formatPrice } from "@/lib/storefront";
import styles from "./PriceTag.module.css";

// The signature element: a kraft price tag. Every ask the vendor has named
// stacks up crossed-out; the live ask sits at the bottom in marker. The
// concession history IS the state of the negotiation.
export default function PriceTag({ vendor, priceHistory }) {
  const current = priceHistory[priceHistory.length - 1];
  const struck = priceHistory.slice(0, -1);

  return (
    <div className={styles.wrap}>
      <span className={styles.string} aria-hidden="true" />
      <div className={styles.tag} key={priceHistory.length}>
        <span className={styles.hole} aria-hidden="true" />
        <p className={styles.label}>{vendor.item}</p>
        {struck.length > 0 && (
          <ul className={styles.history}>
            {struck.map((p, i) => (
              <li key={i} className={styles.struckPrice}>
                {formatPrice(vendor, p)}
              </li>
            ))}
          </ul>
        )}
        <p className={styles.current}>{formatPrice(vendor, current)}</p>
        <p className={styles.foot}>
          {struck.length === 0 ? "asking" : `asking · marked down ×${struck.length}`}
        </p>
      </div>
    </div>
  );
}

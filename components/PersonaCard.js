import { formatPrice } from "@/lib/storefront";
import styles from "./PersonaCard.module.css";

export default function PersonaCard({ vendor, onPick }) {
  return (
    <article className={styles.card}>
      <span className={styles.sticker} aria-hidden="true">
        {formatPrice(vendor, vendor.openingPrice)}
      </span>
      <p className={styles.role}>{vendor.role}</p>
      <h2 className={styles.item}>{vendor.item}</h2>
      <p className={styles.vendorLine}>
        sold by <strong>{vendor.name}</strong>
      </p>
      <p className={styles.tagline}>{vendor.tagline}</p>
      <p className={styles.hint}>{vendor.hint}</p>
      <button className={styles.enter} onClick={onPick}>
        Step up to the stall
      </button>
    </article>
  );
}

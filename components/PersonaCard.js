import { formatPrice } from "@/lib/storefront";
import {
  SalPortrait,
  MarionPortrait,
  LanternIcon,
  HouseIcon,
} from "./VendorArt";
import styles from "./PersonaCard.module.css";

const ART = {
  sal: { Portrait: SalPortrait, Icon: LanternIcon },
  marion: { Portrait: MarionPortrait, Icon: HouseIcon },
};

export default function PersonaCard({ vendor, onPick }) {
  const { Portrait, Icon } = ART[vendor.id] || ART.sal;

  return (
    <article
      className={styles.card}
      style={{ "--accent": vendor.accent, "--accent-soft": `${vendor.accent}22` }}
    >
      <div className={styles.top}>
        <div className={styles.portrait}>
          <Portrait />
        </div>
        <div className={styles.id}>
          <h2 className={styles.name}>{vendor.name}</h2>
          <p className={styles.role}>{vendor.role}</p>
        </div>
      </div>

      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dt>Opening</dt>
          <dd className={styles.ask}>{formatPrice(vendor, vendor.openingPrice)}</dd>
        </div>
        <div className={styles.stat}>
          <dt>Difficulty</dt>
          <dd>{vendor.difficulty}</dd>
        </div>
      </dl>

      <div className={styles.itemRow}>
        <div className={styles.icon}>
          <Icon />
        </div>
        <div className={styles.itemText}>
          <h3 className={styles.item}>{vendor.item}</h3>
          <p className={styles.blurb}>
            {vendor.tagline} {vendor.hint}
          </p>
        </div>
      </div>

      <button className={styles.enter} onClick={onPick}>
        Step up
      </button>
    </article>
  );
}

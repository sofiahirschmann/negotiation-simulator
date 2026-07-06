"use client";

import PriceTag from "./PriceTag";
import {
  SalBackdrop,
  SalCounter,
  SalFigure,
  MarionBackdrop,
  MarionRailing,
  MarionFigure,
} from "./VendorArt";
import styles from "./Scene.module.css";

// The vendor's replies carry a machine marker (⟦ask:…⟧) at the end.
// The canonical transcript keeps it; the player never sees it.
function stripMarker(text) {
  const cut = text.indexOf("⟦");
  return (cut === -1 ? text : text.slice(0, cut)).trim();
}

const ART = {
  sal: { Backdrop: SalBackdrop, Prop: SalCounter, Figure: SalFigure },
  marion: { Backdrop: MarionBackdrop, Prop: MarionRailing, Figure: MarionFigure },
};

export default function Scene({ vendor, messages, streamingText, priceHistory }) {
  const { Backdrop, Prop, Figure } = ART[vendor.id] || ART.sal;

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastVendorMsg = [...messages].reverse().find((m) => m.role === "assistant");

  const thinking = streamingText === "";
  const talking = streamingText !== null && streamingText !== "";
  const vendorLine = talking
    ? streamingText
    : lastVendorMsg
      ? stripMarker(lastVendorMsg.content)
      : null;
  const started = messages.length > 0;

  return (
    <section className={styles.scene}>
      <Backdrop />

      <div className={`${styles.figure} ${talking ? styles.talking : ""}`}>
        <Figure />
      </div>
      <div className={styles.prop}>
        <Prop />
      </div>

      <PriceTag vendor={vendor} priceHistory={priceHistory} />

      {/* vendor speech bubble */}
      {(vendorLine || thinking) && (
        <div className={styles.bubble} key={thinking ? "thinking" : undefined}>
          <p className={styles.bubbleText}>
            {thinking ? <span className={styles.dots} aria-label="thinking" /> : vendorLine}
          </p>
          <span className={styles.tail} aria-hidden="true" />
        </div>
      )}

      {/* your last line, spoken from off-screen */}
      {lastUser && (
        <div className={styles.playerBubble} key={lastUser.content}>
          <p className={styles.playerText}>{lastUser.content}</p>
          <span className={styles.playerTail} aria-hidden="true" />
        </div>
      )}

      {!started && <p className={styles.caption}>{vendor.caption}</p>}
    </section>
  );
}

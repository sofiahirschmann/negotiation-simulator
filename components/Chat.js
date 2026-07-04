"use client";

import { useEffect, useRef } from "react";
import styles from "./Chat.module.css";

// The vendor's replies carry a machine marker (⟦ask:…⟧) at the end.
// The canonical transcript keeps it; the player never sees it.
function stripMarker(text) {
  const cut = text.indexOf("⟦");
  return (cut === -1 ? text : text.slice(0, cut)).trim();
}

export default function Chat({ vendor, messages, streamingText }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, streamingText]);

  const firstName = vendor.name.split(" ")[0];

  return (
    <div className={styles.scroll}>
      {messages.length === 0 && streamingText === null && (
        <p className={styles.empty}>
          You're at the stall. The asking price is on the tag.
          <br />
          Open your mouth. Better yet, open low.
        </p>
      )}
      {messages.map((m, i) =>
        m.role === "user" ? (
          <div key={i} className={styles.buyer}>
            <p className={styles.buyerText}>{m.content}</p>
          </div>
        ) : (
          <div key={i} className={styles.vendor}>
            <span className={styles.vendorName}>{firstName}</span>
            <p className={styles.vendorText}>{stripMarker(m.content)}</p>
          </div>
        )
      )}
      {streamingText !== null && (
        <div className={styles.vendor}>
          <span className={styles.vendorName}>{firstName}</span>
          {streamingText === "" ? (
            <p className={styles.thinking}>
              {firstName} is chewing it over
              <span className={styles.dots} aria-hidden="true" />
            </p>
          ) : (
            <p className={styles.vendorText}>{streamingText}</p>
          )}
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}

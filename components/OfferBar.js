"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/storefront";
import styles from "./OfferBar.module.css";

export default function OfferBar({
  vendor,
  currentAsk,
  busy,
  started,
  onSend,
  onShake,
  onWalk,
}) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <div className={styles.bar}>
      <form className={styles.form} onSubmit={submit}>
        <input
          className={styles.input}
          type="text"
          value={text}
          maxLength={500}
          placeholder={started ? "Your move…" : "Make an offer…"}
          onChange={(e) => setText(e.target.value)}
          disabled={busy}
          autoFocus
        />
        <button
          className={styles.send}
          type="submit"
          disabled={busy || !text.trim()}
          aria-label="Say it"
        >
          Say it
        </button>
      </form>
      {started && (
        <div className={styles.actions}>
          {currentAsk != null && (
            <button className={styles.shake} onClick={onShake} disabled={busy}>
              🤝 Shake hands at {formatPrice(vendor, currentAsk)}
            </button>
          )}
          <button className={styles.walk} onClick={onWalk} disabled={busy}>
            Walk away
          </button>
        </div>
      )}
    </div>
  );
}

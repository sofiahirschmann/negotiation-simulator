"use client";

import { TACTICS } from "@/lib/tactics";
import { formatPrice } from "@/lib/storefront";
import styles from "./Receipt.module.css";

const GRADE_LABELS = {
  sharp: "SHARP",
  decent: "DECENT",
  weak: "WEAK",
  missed: "MISSED",
};

const STATUS_LABELS = {
  deal: "Deal closed",
  walkaway: "They walked",
  "player-walked": "You walked",
};

// Arcade rank stamped from the judge's final score.
function rankFor(score) {
  if (score >= 85) return "S";
  if (score >= 70) return "A";
  if (score >= 55) return "B";
  if (score >= 40) return "C";
  return "D";
}

export default function Receipt({ vendor, status, data, error, onRetry, onReset }) {
  const accentStyle = {
    "--accent": vendor.accent,
    "--accent-soft": `${vendor.accent}22`,
  };

  return (
    <div className={styles.stage}>
      <div className={`${styles.card} panel`} style={accentStyle}>
        <div className="scanlines" aria-hidden="true" />

        <div className={styles.banner}>
          <p className={styles.gameOver}>{STATUS_LABELS[status] || "Game over"}</p>
          <p className={styles.sub}>
            {vendor.name} · {vendor.role}
          </p>
        </div>

        {!data && !error && (
          <p className={styles.tallying}>
            The judge is scoring you
            <span className={styles.dots} />
          </p>
        )}

        {error && (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retry} onClick={onRetry}>
              Run it again
            </button>
          </div>
        )}

        {data && (
          <>
            <div className={styles.hero}>
              <div className={styles.rank}>{rankFor(data.score)}</div>
              <div className={styles.heroRight}>
                <p className={styles.score}>
                  {data.score}
                  <span className={styles.outOf}>/100</span>
                </p>
                <p className={styles.band}>{data.outcome.band.toUpperCase()}</p>
                {data.outcome.finalPrice != null && status === "deal" && (
                  <p className={styles.closedAt}>
                    Closed at {formatPrice(vendor, data.outcome.finalPrice)}
                  </p>
                )}
              </div>
            </div>

            <p className={styles.bandNote}>{data.outcome.bandNote}</p>

            <p className={styles.sectionLabel}>Tactics read</p>
            <div className={styles.tactics}>
              {data.tactics.map((t) => {
                const spec = TACTICS.find((s) => s.id === t.id);
                return (
                  <div key={t.id} className={styles.tactic}>
                    <div className={styles.tacticHead}>
                      <span className={styles.tacticName}>{spec?.name}</span>
                      <span className={`${styles.grade} ${styles[`grade_${t.grade}`] || ""}`}>
                        {GRADE_LABELS[t.grade] || t.grade}
                      </span>
                    </div>
                    <p className={styles.feedback}>{t.feedback}</p>
                  </div>
                );
              })}
            </div>

            <div className={styles.moves}>
              <div className={styles.move}>
                <p className={styles.moveLabel}>Best move</p>
                <p className={styles.feedback}>{data.bestMove}</p>
              </div>
              <div className={styles.move}>
                <p className={styles.moveLabel}>Worst move</p>
                <p className={styles.feedback}>{data.worstMove}</p>
              </div>
            </div>

            <p className={styles.summary}>"{data.summary}"</p>
            <p className={styles.signed}>Signed, the judge</p>
          </>
        )}
      </div>

      <button className={styles.again} onClick={onReset}>
        Back to the market
      </button>
    </div>
  );
}

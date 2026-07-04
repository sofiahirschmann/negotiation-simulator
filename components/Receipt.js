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

export default function Receipt({ vendor, status, data, error, onRetry, onReset }) {
  let line = 0;
  const next = () => ({ "--i": line++ });

  return (
    <div className={styles.stage}>
      <div className={styles.receipt}>
        <div className={styles.tornTop} aria-hidden="true" />
        <div className={styles.paper}>
          <p className={styles.shopName} style={next()}>
            ★ THE HAGGLE ★
          </p>
          <p className={styles.line} style={next()}>
            {vendor.role.toUpperCase()} · {vendor.name.toUpperCase()}
          </p>
          <p className={styles.line} style={next()}>
            {vendor.item.toUpperCase()}
          </p>
          <p className={styles.rule} style={next()} aria-hidden="true">
            ································
          </p>

          {!data && !error && (
            <p className={styles.tallying}>
              TALLYING YOUR PERFORMANCE
              <span className={styles.dots} />
            </p>
          )}

          {error && (
            <>
              <p className={styles.errorText}>{error}</p>
              <button className={styles.retry} onClick={onRetry}>
                Run it again
              </button>
            </>
          )}

          {data && (
            <>
              <div className={styles.row} style={next()}>
                <span>OUTCOME</span>
                <span className={styles.bandName}>{data.outcome.band.toUpperCase()}</span>
              </div>
              {data.outcome.finalPrice != null && status === "deal" && (
                <div className={styles.row} style={next()}>
                  <span>CLOSED AT</span>
                  <span>{formatPrice(vendor, data.outcome.finalPrice)}</span>
                </div>
              )}
              <p className={styles.note} style={next()}>
                {data.outcome.bandNote}
              </p>
              <p className={styles.rule} style={next()} aria-hidden="true">
                ································
              </p>

              {data.tactics.map((t) => {
                const spec = TACTICS.find((s) => s.id === t.id);
                return (
                  <div key={t.id} className={styles.tactic} style={next()}>
                    <div className={styles.row}>
                      <span>{spec?.name.toUpperCase()}</span>
                      <span className={styles[`grade_${t.grade}`] || ""}>
                        {GRADE_LABELS[t.grade] || t.grade}
                      </span>
                    </div>
                    <p className={styles.feedback}>{t.feedback}</p>
                  </div>
                );
              })}

              <p className={styles.rule} style={next()} aria-hidden="true">
                ································
              </p>
              <div className={styles.tactic} style={next()}>
                <p className={styles.moveLabel}>BEST MOVE</p>
                <p className={styles.feedback}>{data.bestMove}</p>
              </div>
              <div className={styles.tactic} style={next()}>
                <p className={styles.moveLabel}>WORST MOVE</p>
                <p className={styles.feedback}>{data.worstMove}</p>
              </div>
              <p className={styles.rule} style={next()} aria-hidden="true">
                ································
              </p>
              <div className={styles.totalRow} style={next()}>
                <span>TOTAL</span>
                <span className={styles.totalScore}>{data.score}/100</span>
              </div>
              <p className={styles.summary} style={next()}>
                “{data.summary}”
              </p>
              <p className={styles.footer} style={next()}>
                signed, the judge
                <br />
                ★ THANK YOU · HAGGLE AGAIN ★
              </p>
            </>
          )}
        </div>
        <div className={styles.tornBottom} aria-hidden="true" />
      </div>

      <button className={styles.again} onClick={onReset}>
        Back to the market
      </button>
    </div>
  );
}

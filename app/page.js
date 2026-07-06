"use client";

import { useCallback, useRef, useState } from "react";
import { STOREFRONT, formatPrice } from "@/lib/storefront";
import PersonaCard from "@/components/PersonaCard";
import Chat from "@/components/Chat";
import Scene from "@/components/Scene";
import { MarketSkyline, TagGlyph } from "@/components/VendorArt";
import OfferBar from "@/components/OfferBar";
import Receipt from "@/components/Receipt";
import styles from "./page.module.css";

const MARKER_RE = /⟦ask:(\d+)\|status:(open|deal|walkaway)⟧/g;

export default function Home() {
  const [vendor, setVendor] = useState(null);
  const [messages, setMessages] = useState([]); // canonical transcript, markers kept
  const [streamingText, setStreamingText] = useState(null); // vendor reply in flight (marker hidden)
  const [priceHistory, setPriceHistory] = useState([]);
  const [status, setStatus] = useState("open"); // open | deal | walkaway | player-walked
  const [scoreData, setScoreData] = useState(null);
  const [scoreError, setScoreError] = useState(null);
  const [chatError, setChatError] = useState(null);
  const [logOpen, setLogOpen] = useState(false);
  const busyRef = useRef(false);

  const currentAsk = priceHistory[priceHistory.length - 1] ?? null;
  const gameOver = status !== "open";
  const turns = messages.filter((m) => m.role === "user").length;

  const pickVendor = (v) => {
    setVendor(v);
    setMessages([]);
    setPriceHistory([v.openingPrice]);
    setStatus("open");
    setScoreData(null);
    setScoreError(null);
    setChatError(null);
  };

  const reset = () => {
    setVendor(null);
    setMessages([]);
    setStreamingText(null);
    setPriceHistory([]);
    setStatus("open");
    setScoreData(null);
    setScoreError(null);
    setChatError(null);
    setLogOpen(false);
    busyRef.current = false;
  };

  const requestScore = useCallback(
    async (transcript, finalStatus) => {
      setScoreError(null);
      try {
        const res = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personaId: vendor.id,
            messages: transcript,
            outcome: { status: finalStatus },
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Scoring failed.");
        setScoreData(data);
      } catch (err) {
        setScoreError(err.message || "Scoring failed.");
      }
    },
    [vendor]
  );

  const endGame = useCallback(
    (finalStatus, transcript) => {
      setStatus(finalStatus);
      requestScore(transcript, finalStatus);
    },
    [requestScore]
  );

  const send = useCallback(
    async (text) => {
      if (busyRef.current || gameOver) return;
      busyRef.current = true;
      setChatError(null);
      const next = [...messages, { role: "user", content: text }];
      setMessages(next);
      setStreamingText("");

      try {
        const res = await fetch("/api/haggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personaId: vendor.id, messages: next }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `The vendor lost their voice (${res.status}).`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          // Withhold the state marker (and anything after it) from display.
          const cut = full.indexOf("⟦");
          setStreamingText(cut === -1 ? full : full.slice(0, cut));
        }
        full += decoder.decode();

        const transcript = [...next, { role: "assistant", content: full }];
        setMessages(transcript);
        setStreamingText(null);

        const marker = [...full.matchAll(MARKER_RE)].pop();
        if (marker) {
          const ask = parseInt(marker[1], 10);
          const newStatus = marker[2];
          setPriceHistory((h) => (h[h.length - 1] === ask ? h : [...h, ask]));
          if (newStatus !== "open") endGame(newStatus, transcript);
        }
      } catch (err) {
        // Roll the failed turn back so the player can retry.
        setMessages(messages);
        setStreamingText(null);
        setChatError(err.message || "Something went wrong. Try again.");
      } finally {
        busyRef.current = false;
      }
    },
    [messages, vendor, gameOver, endGame]
  );

  const shakeHands = () => {
    if (currentAsk == null) return;
    send(`Deal. ${formatPrice(vendor, currentAsk)}. Shake on it.`);
  };

  const walkAway = () => {
    if (busyRef.current) return;
    const transcript = [
      ...messages,
      { role: "user", content: "(The buyer walks away.)" },
    ];
    setMessages(transcript);
    endGame("player-walked", transcript);
  };

  if (!vendor) {
    return (
      <main className={styles.select}>
        <div className={styles.marquee}>
          <header className={styles.marketHeader}>
            <MarketSkyline />
            <h1 className={styles.logo}>THE HAGGLE</h1>
            <p className={styles.insert}>Saturday market // 2 stalls open</p>
          </header>
          <p className={styles.tagline}>
            Talk them down. Every dollar is a fight.
            <br />
            When it's over, a judge grades your tactics, not your charm.
          </p>
          <div className={styles.divider} aria-hidden="true">
            <TagGlyph />
          </div>
          <p className={styles.selectPrompt}>Select your mark</p>
          <div className={styles.roster}>
            {STOREFRONT.map((v) => (
              <PersonaCard key={v.id} vendor={v} onPick={() => pickVendor(v)} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (gameOver) {
    return (
      <main className={styles.receiptStage}>
        <Receipt
          vendor={vendor}
          status={status}
          data={scoreData}
          error={scoreError}
          onRetry={() => requestScore(messages, status)}
          onReset={reset}
        />
      </main>
    );
  }

  const firstName = vendor.name.split(" ")[0];

  return (
    <main className={styles.game}>
      <div
        className={`${styles.cabinet} panel`}
        style={{
          "--accent": vendor.accent,
          "--accent-soft": `${vendor.accent}22`,
        }}
      >
        <header className={styles.hud}>
          <button className={styles.leave} onClick={reset}>
            &lt; Leave
          </button>
          <span className={styles.hudTitle}>THE HAGGLE</span>
          <div className={styles.hudStats}>
            <button
              className={`chip ${styles.logButton} ${logOpen ? styles.logOpenBtn : ""}`}
              onClick={() => setLogOpen((o) => !o)}
            >
              Log
            </button>
            <span className="chip">{firstName}</span>
            <span className="chip">Turn {turns}</span>
            <span className={`chip ${styles.chipAsk}`}>
              {formatPrice(vendor, currentAsk)}
            </span>
          </div>
        </header>

        <div className={styles.screen}>
          <div className="scanlines" aria-hidden="true" />

          <Scene
            vendor={vendor}
            messages={messages}
            streamingText={streamingText}
            priceHistory={priceHistory}
          />

          <section className={styles.commandBar}>
            {chatError && <p className={styles.chatError}>{chatError}</p>}
            <OfferBar
              vendor={vendor}
              currentAsk={currentAsk}
              busy={streamingText !== null}
              started={messages.length > 0}
              onSend={send}
              onShake={shakeHands}
              onWalk={walkAway}
            />
          </section>

          {logOpen && (
            <aside className={styles.logPanel}>
              <div className={styles.logHead}>
                <span>Haggle log</span>
                <button className={styles.logClose} onClick={() => setLogOpen(false)}>
                  Close
                </button>
              </div>
              <Chat
                vendor={vendor}
                messages={messages}
                streamingText={streamingText}
              />
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}

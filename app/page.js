"use client";

import { useCallback, useRef, useState } from "react";
import { STOREFRONT, formatPrice } from "@/lib/storefront";
import PersonaCard from "@/components/PersonaCard";
import Chat from "@/components/Chat";
import PriceTag from "@/components/PriceTag";
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
  const busyRef = useRef(false);

  const currentAsk = priceHistory[priceHistory.length - 1] ?? null;
  const gameOver = status !== "open";

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
      <main className={styles.picker}>
        <header className={styles.masthead}>
          <p className={styles.eyebrow}>Saturday market · two stalls open</p>
          <h1 className={styles.title}>The Haggle</h1>
          <p className={styles.subtitle}>
            Talk them down. Every dollar is a fight. When it's over, a judge
            grades your tactics, not your charm.
          </p>
        </header>
        <div className={styles.stalls}>
          {STOREFRONT.map((v) => (
            <PersonaCard key={v.id} vendor={v} onPick={() => pickVendor(v)} />
          ))}
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

  return (
    <main className={styles.game}>
      <header className={styles.gameHeader}>
        <button className={styles.backLink} onClick={reset}>
          ← the market
        </button>
        <div className={styles.stallSign}>
          <span className={styles.stallName}>{vendor.name}</span>
          <span className={styles.stallItem}>{vendor.item}</span>
        </div>
      </header>

      <div className={styles.gameBody}>
        <section className={styles.chatColumn}>
          <Chat
            vendor={vendor}
            messages={messages}
            streamingText={streamingText}
          />
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
        <aside className={styles.tagRail}>
          <PriceTag vendor={vendor} priceHistory={priceHistory} />
        </aside>
      </div>
    </main>
  );
}

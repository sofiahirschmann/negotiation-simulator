import styles from "./Scene.module.css";

// All scene art is inline SVG in a flat, outlined vector style.
// Animated parts (eyes, mouth, gesture arm, clouds, pigeon) carry classes
// from Scene.module.css; Scene.js toggles `talking` on the figure wrapper.

const INK = "#2b2016";

/* ============ title screen: skyline, portraits, item icons ============ */

/* Muted silhouette of both vendors' worlds: Sal's stall row on the left,
   Marion's townhouse on the right. Sits behind the logo. */
export function MarketSkyline() {
  const line = "#3b2e5c";
  const dark = "#241b3e";
  const mid = "#2c2249";
  const glow = "#c9a24a";
  return (
    <svg
      className={styles.skylineSvg}
      viewBox="0 0 1000 190"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {/* shifted down so the strip keeps sky headroom above the rooflines */}
      <g stroke={line} strokeWidth="3" transform="translate(0,26)">
        {/* Sal's stall */}
        <path d="M30 78 L250 78 L228 34 L52 34 Z" fill={mid} />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${64 + i * 56} 78 L${74 + i * 56} 34 L${94 + i * 56} 34 L${84 + i * 56} 78 Z`}
            fill={dark}
            stroke="none"
          />
        ))}
        <rect x="42" y="78" width="10" height="88" fill={mid} />
        <rect x="218" y="78" width="10" height="88" fill={mid} />
        <rect x="30" y="118" width="220" height="48" fill={dark} />
        {/* crates + barrel */}
        <rect x="262" y="128" width="34" height="38" fill={mid} />
        <rect x="270" y="102" width="30" height="26" fill={dark} />
        <path d="M312 122 Q328 114 344 122 L344 166 L312 166 Z" fill={mid} />
        {/* lamppost, lit */}
        <rect x="392" y="52" width="7" height="114" fill={mid} />
        <path d="M370 58 Q395 40 420 58" fill="none" />
        <circle cx="370" cy="58" r="9" fill={glow} opacity="0.4" />
        <circle cx="420" cy="58" r="9" fill={glow} opacity="0.4" />

        {/* Marion's townhouse */}
        <rect x="730" y="36" width="222" height="130" fill={mid} />
        <rect x="730" y="24" width="222" height="14" fill={dark} />
        {[0, 1].map((r) =>
          [0, 1].map((c) => (
            <rect
              key={`${r}${c}`}
              x={752 + c * 60}
              y={54 + r * 48}
              width="28"
              height="34"
              fill={r === 0 && c === 1 ? glow : dark}
              opacity={r === 0 && c === 1 ? "0.25" : "1"}
            />
          ))
        )}
        <rect x="884" y="92" width="44" height="74" fill={dark} />
        <rect x="874" y="166" width="64" height="10" fill={dark} />
        {/* FOR RENT board */}
        <line x1="700" y1="64" x2="700" y2="86" />
        <rect x="672" y="86" width="56" height="38" fill={dark} />
        <rect x="682" y="96" width="36" height="6" fill={line} stroke="none" />
        <rect x="682" y="108" width="36" height="6" fill={line} stroke="none" />
      </g>
      {/* low moon */}
      <circle cx="972" cy="46" r="15" fill={glow} opacity="0.3" />
    </svg>
  );
}

/* Small rotated price-tag glyph for the divider. */
export function TagGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <g transform="rotate(24 12 12)">
        <path
          d="M4 9 L11 3 L20 3 L20 12 L11 20 L4 13 Z"
          fill="#c9a24a"
          stroke="#8a6a2b"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="7" r="2" fill="#171225" />
      </g>
    </svg>
  );
}

export function SalPortrait() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <clipPath id="pp-sal">
          <circle cx="60" cy="60" r="55" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="55" fill="#1a1330" />
      <g clipPath="url(#pp-sal)">
      <g stroke={INK} strokeWidth="3" transform="translate(-50,-18)">
        <rect x="98" y="122" width="24" height="18" fill="#e8b98a" />
        <path
          d="M78 70 Q78 40 110 40 Q142 40 142 70 L140 106 Q138 130 110 130 Q82 130 80 106 Z"
          fill="#e8b98a"
        />
        <circle cx="79" cy="92" r="7" fill="#e8b98a" />
        <path d="M74 66 Q78 34 112 34 Q146 36 146 66 L146 72 L74 72 Z" fill="#6b4a2e" />
        <path d="M74 66 L54 74 L74 80 Z" fill="#57391f" />
        <path d="M88 82 L104 78" strokeWidth="4" />
        <path d="M118 78 L134 82" strokeWidth="4" />
        <circle cx="96" cy="90" r="4.5" fill={INK} stroke="none" />
        <circle cx="126" cy="90" r="4.5" fill={INK} stroke="none" />
        <path d="M110 92 Q116 102 108 106" fill="none" strokeWidth="2.5" />
        <ellipse cx="111" cy="118" rx="9" ry="2" fill="#5a2f23" stroke="none" />
        <path
          d="M92 108 Q111 100 130 108 Q128 118 111 112 Q94 118 92 108 Z"
          fill="#b8b0a4"
        />
      </g>
      </g>
      <circle cx="60" cy="60" r="55" fill="none" stroke="#c9a24a" strokeWidth="4" />
    </svg>
  );
}

export function MarionPortrait() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <clipPath id="pp-mar">
          <circle cx="60" cy="60" r="55" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="55" fill="#1a1330" />
      <g clipPath="url(#pp-mar)">
      <g stroke={INK} strokeWidth="3" transform="translate(-50,-18)">
        <rect x="100" y="124" width="20" height="16" fill="#e8b98a" />
        <path
          d="M82 72 Q82 44 110 44 Q138 44 138 72 L136 104 Q134 128 110 128 Q86 128 84 104 Z"
          fill="#e8b98a"
        />
        <path
          d="M76 116 Q70 52 110 38 Q150 52 144 116 L132 116 Q140 76 126 62 Q118 74 94 70 Q84 78 88 116 Z"
          fill="#5a3a2e"
        />
        <circle cx="82" cy="108" r="4" fill="#f0ece2" />
        <g fill="none" strokeWidth="2.5">
          <rect x="88" y="84" width="18" height="13" rx="4" />
          <rect x="114" y="84" width="18" height="13" rx="4" />
          <line x1="106" y1="90" x2="114" y2="90" />
        </g>
        <circle cx="97" cy="91" r="3.5" fill={INK} stroke="none" />
        <circle cx="123" cy="91" r="3.5" fill={INK} stroke="none" />
        <path d="M89 79 Q97 75 105 79" strokeWidth="3" fill="none" />
        <path d="M115 77 Q123 72 131 78" strokeWidth="3" fill="none" />
        <path d="M110 94 Q114 102 108 105" fill="none" strokeWidth="2" />
        <ellipse cx="110" cy="114" rx="7" ry="2" fill="#8a4634" stroke="none" />
      </g>
      </g>
      <circle cx="60" cy="60" r="55" fill="none" stroke="#c9a24a" strokeWidth="4" />
    </svg>
  );
}

/* The goods, as card thumbnails. */
export function LanternIcon() {
  return (
    <svg viewBox="0 0 90 110" aria-hidden="true">
      <circle cx="45" cy="58" r="40" fill="#f0a836" opacity="0.1" />
      <g stroke={INK} strokeWidth="3">
        <path d="M30 26 Q45 6 60 26" fill="none" />
        <path d="M26 36 L64 36 L58 22 L32 22 Z" fill="#c9a24a" />
        <rect x="30" y="36" width="30" height="42" fill="#f2d98c" />
        <ellipse cx="45" cy="60" rx="7" ry="11" fill="#f0a836" stroke="none" />
        <line x1="38" y1="36" x2="38" y2="78" strokeWidth="2" />
        <line x1="52" y1="36" x2="52" y2="78" strokeWidth="2" />
        <rect x="24" y="78" width="42" height="10" fill="#c9a24a" />
        <rect x="30" y="88" width="30" height="8" fill="#8a6a2b" />
      </g>
    </svg>
  );
}

export function HouseIcon() {
  return (
    <svg viewBox="0 0 90 110" aria-hidden="true">
      <g stroke={INK} strokeWidth="3">
        <rect x="14" y="20" width="62" height="76" fill="#b96a4f" />
        <rect x="10" y="10" width="70" height="12" fill="#8a4634" />
        <g stroke="#a05540" strokeWidth="1.5">
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="16" y1={36 + i * 16} x2="74" y2={36 + i * 16} />
          ))}
        </g>
        <rect x="22" y="30" width="16" height="22" fill="#d3e5ea" />
        <rect x="52" y="30" width="16" height="22" fill="#d3e5ea" />
        <rect x="22" y="62" width="16" height="22" fill="#d3e5ea" />
        <rect x="48" y="58" width="22" height="38" fill="#3f6f5f" />
        <circle cx="65" cy="78" r="2.5" fill="#c9a24a" stroke="none" />
        <rect x="44" y="96" width="30" height="8" fill="#9c9585" />
      </g>
    </svg>
  );
}

/* ================= Sal: daylight flea-market street ================= */

export function SalBackdrop() {
  return (
    <svg
      className={styles.backdropSvg}
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sal-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7dfae" />
          <stop offset="1" stopColor="#f2c27e" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#sal-sky)" />
      <circle cx="700" cy="64" r="34" fill="#fbeecb" />

      {/* drifting clouds */}
      <g className={styles.cloudA} fill="#fbf0d8" opacity="0.9">
        <ellipse cx="150" cy="60" rx="52" ry="16" />
        <ellipse cx="190" cy="48" rx="34" ry="13" />
      </g>
      <g className={styles.cloudB} fill="#fbf0d8" opacity="0.75">
        <ellipse cx="480" cy="90" rx="44" ry="13" />
        <ellipse cx="512" cy="80" rx="26" ry="10" />
      </g>

      {/* building row */}
      <g stroke={INK} strokeWidth="3">
        {/* left ochre building */}
        <rect x="-10" y="120" width="230" height="242" fill="#e5c17f" />
        <rect x="-10" y="104" width="230" height="22" fill="#a86a3a" />
        {[0, 1].map((r) =>
          [0, 1, 2].map((c) => (
            <g key={`${r}${c}`}>
              <rect
                x={22 + c * 66}
                y={148 + r * 84}
                width="36"
                height="52"
                fill="#7a5636"
              />
              <line
                x1={40 + c * 66}
                y1={148 + r * 84}
                x2={40 + c * 66}
                y2={200 + r * 84}
                strokeWidth="2"
              />
            </g>
          ))
        )}
        {/* café with awning */}
        <rect x="220" y="150" width="180" height="212" fill="#efe0bd" />
        <rect x="220" y="136" width="180" height="20" fill="#8a5a33" />
        <rect x="234" y="238" width="60" height="42" fill="#6b4a2e" />
        <rect x="316" y="238" width="60" height="42" fill="#6b4a2e" />
        <rect x="240" y="300" width="52" height="62" fill="#4a3320" />
        {/* striped awning */}
        <g>
          <path d="M228 214 L392 214 L378 186 L242 186 Z" fill="#c0392b" />
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${254 + i * 34} 214 L${262 + i * 34} 186 L${278 + i * 34} 186 L${270 + i * 34} 214 Z`}
              fill="#f4e6c8"
              stroke="none"
            />
          ))}
        </g>
        <rect x="238" y="164" width="128" height="16" fill="#f4e6c8" />
        {/* tall back building */}
        <rect x="400" y="96" width="210" height="266" fill="#d9a86a" />
        <rect x="400" y="82" width="210" height="18" fill="#8a5a33" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`b${r}${c}`}
              x={420 + c * 62}
              y={118 + r * 74}
              width="34"
              height="48"
              fill="#7a5636"
            />
          ))
        )}
        {/* antiques sign on the tall building (kept in the slice-safe zone) */}
        <rect x="428" y="240" width="154" height="26" fill="#5a3a24" />
        <text
          x="505"
          y="259"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="15"
          fill="#f2e2c0"
          stroke="none"
          letterSpacing="2"
        >
          ANTIQUES
        </text>
        {/* shop, right */}
        <rect x="610" y="140" width="200" height="222" fill="#e8cf9a" />
        <rect x="610" y="126" width="200" height="18" fill="#a86a3a" />
        <rect x="640" y="220" width="56" height="72" fill="#6b4a2e" />
        <rect x="716" y="220" width="56" height="72" fill="#6b4a2e" />
      </g>

      {/* cobbled ground */}
      <rect x="-10" y="360" width="820" height="100" fill="#c2ab8b" stroke={INK} strokeWidth="3" />
      <g stroke="#a58c6b" strokeWidth="2" fill="none">
        {[0, 1, 2].map((r) => (
          <g key={r}>
            {[...Array(11)].map((_, c) => (
              <ellipse
                key={c}
                cx={20 + c * 78 + (r % 2) * 39}
                cy={382 + r * 26}
                rx="30"
                ry="7"
              />
            ))}
          </g>
        ))}
      </g>

      {/* lamppost with twin globes */}
      <g stroke={INK} strokeWidth="3">
        <rect x="366" y="238" width="8" height="126" fill="#4a4038" />
        <path d="M340 244 Q370 224 400 244" fill="none" />
        <circle cx="340" cy="244" r="11" fill="#fbf0d8" />
        <circle cx="400" cy="244" r="11" fill="#fbf0d8" />
      </g>

      {/* neighbour stall, left */}
      <g stroke={INK} strokeWidth="3">
        <rect x="60" y="300" width="150" height="14" fill="#8a5a33" />
        <rect x="68" y="314" width="10" height="52" fill="#6b4a2e" />
        <rect x="192" y="314" width="10" height="52" fill="#6b4a2e" />
        <rect x="74" y="268" width="52" height="32" fill="#b98c4a" />
        <rect x="132" y="276" width="44" height="24" fill="#9a6b3f" />
        <path d="M48 268 L222 268 L206 236 L64 236 Z" fill="#b3542e" />
      </g>

      {/* pigeon */}
      <g className={styles.pigeon}>
        <g stroke={INK} strokeWidth="2.5">
          <ellipse cx="300" cy="416" rx="16" ry="10" fill="#8d8d99" />
          <g className={styles.pigeonHead}>
            <circle cx="284" cy="408" r="7" fill="#6f6f7d" />
            <path d="M277 408 L270 411 L277 413 Z" fill="#d9a13b" />
          </g>
          <line x1="296" y1="426" x2="296" y2="432" />
          <line x1="306" y1="426" x2="306" y2="432" />
        </g>
      </g>
    </svg>
  );
}

/* Sal's counter sits in front of him: wood, junk, and the lantern itself. */
export function SalCounter() {
  return (
    <svg
      className={styles.counterSvg}
      viewBox="0 0 340 190"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <g stroke={INK} strokeWidth="3">
        {/* tabletop + plank front */}
        <rect x="6" y="60" width="328" height="18" fill="#9a6b3f" />
        <rect x="16" y="78" width="308" height="104" fill="#7a4f2c" />
        <line x1="16" y1="112" x2="324" y2="112" strokeWidth="2" />
        <line x1="16" y1="146" x2="324" y2="146" strokeWidth="2" />

        {/* the brass ship's lantern */}
        <g>
          <path d="M62 56 Q78 30 94 56" fill="none" />
          <rect x="58" y="52" width="40" height="8" fill="#c9a24a" />
          <path d="M60 24 L96 24 L92 12 L64 12 Z" fill="#c9a24a" />
          <rect x="64" y="24" width="28" height="30" fill="#f2d98c" />
          <line x1="71" y1="24" x2="71" y2="54" strokeWidth="2" />
          <line x1="85" y1="24" x2="85" y2="54" strokeWidth="2" />
        </g>

        {/* stack of old books */}
        <rect x="150" y="44" width="66" height="10" fill="#7d8a6a" />
        <rect x="156" y="34" width="58" height="10" fill="#b3542e" />
        <rect x="152" y="24" width="60" height="10" fill="#5a6a7d" />

        {/* teapot */}
        <g>
          <ellipse cx="248" cy="46" rx="22" ry="15" fill="#d9d2bd" />
          <path d="M268 40 Q282 42 276 52" fill="none" />
          <path d="M234 34 Q248 24 262 34" fill="none" />
        </g>
      </g>
    </svg>
  );
}

export function SalFigure() {
  return (
    <svg
      className={styles.figureSvg}
      viewBox="0 0 220 340"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <g stroke={INK} strokeWidth="3">
        {/* legs + boots */}
        <rect x="84" y="248" width="22" height="72" fill="#4a4038" />
        <rect x="114" y="248" width="22" height="72" fill="#4a4038" />
        <ellipse cx="93" cy="326" rx="17" ry="9" fill="#2f2820" />
        <ellipse cx="127" cy="326" rx="17" ry="9" fill="#2f2820" />

        {/* static arm (viewer left), resting on the counter */}
        <path d="M76 166 Q56 194 58 222" fill="none" strokeWidth="14" stroke="#d9d2bd" />
        <path d="M76 166 Q56 194 58 222" fill="none" />
        <circle cx="58" cy="230" r="11" fill="#e8b98a" />

        {/* torso: shirt + apron */}
        <path d="M68 150 Q110 136 152 150 L158 258 L62 258 Z" fill="#d9d2bd" />
        <path d="M78 158 L142 158 L152 258 L68 258 Z" fill="#6a6f4c" />
        <line x1="86" y1="158" x2="82" y2="140" strokeWidth="2.5" />
        <line x1="134" y1="158" x2="138" y2="140" strokeWidth="2.5" />

        {/* gesture arm (viewer right): raises while talking */}
        <g className={styles.gestureArm}>
          <path d="M146 168 Q176 184 178 212" fill="none" strokeWidth="14" stroke="#d9d2bd" />
          <path d="M146 168 Q176 184 178 212" fill="none" />
          <circle cx="180" cy="218" r="11" fill="#e8b98a" />
        </g>

        {/* head */}
        <g className={styles.head}>
          <rect x="98" y="122" width="24" height="18" fill="#e8b98a" />
          <path
            d="M78 70 Q78 40 110 40 Q142 40 142 70 L140 106 Q138 130 110 130 Q82 130 80 106 Z"
            fill="#e8b98a"
          />
          {/* ear */}
          <circle cx="79" cy="92" r="7" fill="#e8b98a" />
          {/* flat cap, brim toward the buyer */}
          <path d="M74 66 Q78 34 112 34 Q146 36 146 66 L146 72 L74 72 Z" fill="#6b4a2e" />
          <path d="M74 66 L54 74 L74 80 Z" fill="#57391f" />
          {/* brows */}
          <path d="M88 82 L104 78" strokeWidth="4" />
          <path d="M118 78 L134 82" strokeWidth="4" />
          {/* eyes + lids */}
          <g>
            <circle cx="96" cy="90" r="4.5" fill={INK} stroke="none" />
            <circle cx="126" cy="90" r="4.5" fill={INK} stroke="none" />
            <rect className={styles.blink} x="88" y="83" width="16" height="14" fill="#e8b98a" stroke="none" />
            <rect className={styles.blink} x="118" y="83" width="16" height="14" fill="#e8b98a" stroke="none" />
          </g>
          {/* nose */}
          <path d="M110 92 Q116 102 108 106" fill="none" strokeWidth="2.5" />
          {/* mouth flaps under the moustache */}
          <ellipse className={styles.mouth} cx="111" cy="118" rx="9" ry="6" fill="#5a2f23" stroke="none" />
          {/* grand grey moustache */}
          <path
            d="M92 108 Q111 100 130 108 Q128 118 111 112 Q94 118 92 108 Z"
            fill="#b8b0a4"
          />
        </g>
      </g>
    </svg>
  );
}

/* ================= Marion: townhouse stoop ================= */

export function MarionBackdrop() {
  return (
    <svg
      className={styles.backdropSvg}
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mar-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3e5ea" />
          <stop offset="1" stopColor="#b8d2da" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#mar-sky)" />

      <g className={styles.cloudA} fill="#eef6f7" opacity="0.9">
        <ellipse cx="180" cy="58" rx="54" ry="15" />
        <ellipse cx="222" cy="46" rx="32" ry="12" />
      </g>
      <g className={styles.cloudB} fill="#eef6f7" opacity="0.75">
        <ellipse cx="560" cy="84" rx="46" ry="13" />
      </g>

      {/* neighbour house, left */}
      <g stroke={INK} strokeWidth="3">
        <rect x="-10" y="110" width="300" height="252" fill="#c9cdd4" />
        <rect x="-10" y="96" width="300" height="18" fill="#6a7280" />
        {[0, 1].map((r) =>
          [0, 1, 2].map((c) => (
            <g key={`${r}${c}`}>
              <rect
                x={26 + c * 88}
                y={140 + r * 96}
                width="42"
                height="60"
                fill="#5a6a7d"
              />
              <rect
                x={26 + c * 88}
                y={134 + r * 96}
                width="42"
                height="8"
                fill="#eef2f4"
              />
            </g>
          ))
        )}
        {/* street tree */}
        <rect x="86" y="300" width="12" height="62" fill="#6b4a2e" />
        <ellipse cx="92" cy="278" rx="46" ry="36" fill="#7d9a6a" />
      </g>

      {/* Marion's brick townhouse */}
      <g stroke={INK} strokeWidth="3">
        <rect x="290" y="70" width="420" height="292" fill="#b96a4f" />
        <rect x="290" y="54" width="420" height="20" fill="#8a4634" />
        {/* brick courses */}
        <g stroke="#a05540" strokeWidth="2">
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <line key={r} x1="292" y1={110 + r * 42} x2="708" y2={110 + r * 42} />
          ))}
        </g>
        {/* tall sash windows with white trim + boxes */}
        {[0, 1].map((c) => (
          <g key={c}>
            <rect x={330 + c * 130} y="104" width="64" height="92" fill="#3f4a5a" />
            <rect x={322 + c * 130} y="96" width="80" height="10" fill="#f0ece2" />
            <line x1={362 + c * 130} y1="104" x2={362 + c * 130} y2="196" stroke="#f0ece2" strokeWidth="4" />
            <rect x={324 + c * 130} y="196" width="76" height="12" fill="#f0ece2" />
            <rect x={328 + c * 130} y="208" width="68" height="14" fill="#5f7350" />
          </g>
        ))}
        <rect x="330" y="248" width="64" height="92" fill="#3f4a5a" />
        <rect x="322" y="240" width="80" height="10" fill="#f0ece2" />

        {/* entry: portico, mint door, steps */}
        <rect x="500" y="150" width="180" height="212" fill="#a05540" />
        <rect x="488" y="134" width="204" height="20" fill="#f0ece2" />
        <rect x="496" y="154" width="12" height="208" fill="#f0ece2" />
        <rect x="672" y="154" width="12" height="208" fill="#f0ece2" />
        <rect x="530" y="190" width="120" height="172" fill="#3f6f5f" />
        <rect x="540" y="204" width="44" height="56" fill="#325a4d" />
        <rect x="596" y="204" width="44" height="56" fill="#325a4d" />
        <rect x="540" y="274" width="44" height="72" fill="#325a4d" />
        <rect x="596" y="274" width="44" height="72" fill="#325a4d" />
        <circle cx="592" cy="286" r="5" fill="#c9a24a" />
        {/* transom */}
        <rect x="530" y="168" width="120" height="16" fill="#d3e5ea" />

        {/* FOR RENT hanging sign */}
        <g>
          <line x1="420" y1="150" x2="472" y2="150" strokeWidth="5" />
          <line x1="446" y1="150" x2="446" y2="170" strokeWidth="2.5" />
          <rect x="408" y="170" width="76" height="44" fill="#f0ece2" />
          <text
            x="446"
            y="188"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="13"
            fontWeight="bold"
            fill={INK}
            stroke="none"
          >
            FOR
          </text>
          <text
            x="446"
            y="205"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="13"
            fontWeight="bold"
            fill={INK}
            stroke="none"
          >
            RENT
          </text>
        </g>
      </g>

      {/* sidewalk */}
      <rect x="-10" y="360" width="820" height="100" fill="#b9b3a6" stroke={INK} strokeWidth="3" />
      <g stroke="#978f7e" strokeWidth="2">
        {[...Array(7)].map((_, i) => (
          <line key={i} x1={40 + i * 120} y1="360" x2={20 + i * 120} y2="450" />
        ))}
      </g>

      {/* stoop steps under the door */}
      <g stroke={INK} strokeWidth="3">
        <rect x="516" y="362" width="150" height="16" fill="#8f8878" />
        <rect x="506" y="378" width="170" height="16" fill="#9c9585" />
        <rect x="496" y="394" width="190" height="16" fill="#a9a292" />
        {/* potted plant */}
        <path d="M478 342 L506 342 L500 372 L484 372 Z" fill="#b3542e" />
        <ellipse cx="492" cy="332" rx="20" ry="16" fill="#5f7350" />
      </g>
    </svg>
  );
}

/* Iron railing in front of Marion's steps. */
export function MarionRailing() {
  return (
    <svg
      className={styles.counterSvg}
      viewBox="0 0 340 190"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <g stroke={INK} strokeWidth="3">
        <rect x="10" y="70" width="320" height="10" fill="#3a3a42" />
        {[...Array(8)].map((_, i) => (
          <rect key={i} x={26 + i * 40} y="80" width="7" height="100" fill="#3a3a42" />
        ))}
        <rect x="10" y="178" width="320" height="8" fill="#3a3a42" />
        <circle cx="14" cy="64" r="7" fill="#3a3a42" />
        <circle cx="326" cy="64" r="7" fill="#3a3a42" />
      </g>
    </svg>
  );
}

export function MarionFigure() {
  return (
    <svg
      className={styles.figureSvg}
      viewBox="0 0 220 340"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <g stroke={INK} strokeWidth="3">
        {/* slacks + shoes */}
        <rect x="88" y="240" width="20" height="80" fill="#3f4a5a" />
        <rect x="114" y="240" width="20" height="80" fill="#3f4a5a" />
        <ellipse cx="96" cy="326" rx="15" ry="8" fill="#2f2820" />
        <ellipse cx="124" cy="326" rx="15" ry="8" fill="#2f2820" />

        {/* blazer torso */}
        <path d="M72 152 Q110 138 148 152 L152 250 L68 250 Z" fill="#4a5568" />
        {/* blouse V */}
        <path d="M98 150 L110 176 L122 150 Z" fill="#f0ece2" />
        {/* lapels */}
        <path d="M98 150 L92 178 L104 166 Z" fill="#3a4354" />
        <path d="M122 150 L128 178 L116 166 Z" fill="#3a4354" />

        {/* static arm holding clipboard */}
        <path d="M76 164 Q60 196 74 220" fill="none" strokeWidth="13" stroke="#4a5568" />
        <rect x="64" y="206" width="58" height="76" rx="3" fill="#c9a24a" transform="rotate(-8 93 244)" />
        <rect x="72" y="214" width="42" height="58" fill="#f0ece2" transform="rotate(-8 93 243)" stroke="none" />
        <line x1="80" y1="228" x2="108" y2="224" stroke="#9d9482" strokeWidth="2.5" />
        <line x1="82" y1="240" x2="110" y2="236" stroke="#9d9482" strokeWidth="2.5" />
        <circle cx="86" cy="216" r="8" fill="#e8b98a" />

        {/* gesture arm: lifts while talking */}
        <g className={styles.gestureArm}>
          <path d="M144 166 Q172 186 172 214" fill="none" strokeWidth="13" stroke="#4a5568" />
          <circle cx="174" cy="220" r="10" fill="#e8b98a" />
        </g>

        {/* head */}
        <g className={styles.head}>
          <rect x="100" y="124" width="20" height="16" fill="#e8b98a" />
          <path
            d="M82 72 Q82 44 110 44 Q138 44 138 72 L136 104 Q134 128 110 128 Q86 128 84 104 Z"
            fill="#e8b98a"
          />
          {/* bob hair */}
          <path
            d="M76 116 Q70 52 110 38 Q150 52 144 116 L132 116 Q140 76 126 62 Q118 74 94 70 Q84 78 88 116 Z"
            fill="#5a3a2e"
          />
          {/* pearl earring */}
          <circle cx="82" cy="108" r="4" fill="#f0ece2" />
          {/* glasses */}
          <g fill="none" strokeWidth="2.5">
            <rect x="88" y="84" width="18" height="13" rx="4" />
            <rect x="114" y="84" width="18" height="13" rx="4" />
            <line x1="106" y1="90" x2="114" y2="90" />
          </g>
          {/* eyes + lids */}
          <g>
            <circle cx="97" cy="91" r="3.5" fill={INK} stroke="none" />
            <circle cx="123" cy="91" r="3.5" fill={INK} stroke="none" />
            <rect className={styles.blink} x="90" y="85" width="14" height="11" fill="#e8b98a" stroke="none" />
            <rect className={styles.blink} x="116" y="85" width="14" height="11" fill="#e8b98a" stroke="none" />
          </g>
          {/* brows: one arched */}
          <path d="M89 79 Q97 75 105 79" strokeWidth="3" fill="none" />
          <path d="M115 77 Q123 72 131 78" strokeWidth="3" fill="none" />
          {/* nose */}
          <path d="M110 94 Q114 102 108 105" fill="none" strokeWidth="2" />
          {/* composed mouth */}
          <ellipse className={styles.mouth} cx="110" cy="114" rx="7" ry="4.5" fill="#8a4634" stroke="none" />
        </g>
      </g>
    </svg>
  );
}

/**
 * BalloonBackground — Balon love naik ke atas dengan tali & kertas bergoyang
 * Dipakai di LoginScene dan WelcomeScene.
 */

const BALLOON_COLORS = [
  "#ff6b9d", "#e8384f", "#ff85b3",
  "#ff4081", "#f06292", "#ff69b4",
  "#da1b6e", "#ff9ec6", "#fc2f70",
];

interface BalloonData {
  id: number;
  x: number;        // % dari kiri
  size: number;     // ukuran balon px
  color: string;
  duration: number; // detik naik
  delay: number;    // detik delay (negatif = sudah mulai)
  swayDur: number;  // detik goyang tali
  noteSway: number; // detik goyang kertas
}

// Generate di module level → random sekali, tidak re-render
const BALLOONS: BalloonData[] = Array.from({ length: 20 }, (_, i) => {
  const dur = 13 + Math.random() * 11;          // 13–24 detik naik
  return {
    id: i,
    x: Math.random() * 93 + 1,                 // 1–94% (random)
    size: 38 + Math.random() * 36,              // 38–74px
    color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
    duration: dur,
    delay: -(dur * Math.random()),              // negatif → langsung kelihatan, tidak gap
    swayDur: 2.2 + Math.random() * 2.6,        // 2.2–4.8s goyang tali
    noteSway: 1.4 + Math.random() * 1.8,       // 1.4–3.2s goyang kertas
  };
});

function LoveBalloon({ id, x, size, color, duration, delay, swayDur, noteSway }: BalloonData) {
  const stringLen = Math.round(size * 2.3);
  const noteFont  = Math.max(Math.round(size * 0.145), 8);
  const gradId    = `lg_${id}`;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        bottom: `-${Math.round(size * 0.95 + stringLen + 55)}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        animation: `balloonFloat ${duration}s linear ${delay}s infinite`,
        willChange: "transform",
        pointerEvents: "none",
      }}
    >
      {/* ❤ Balon berbentuk hati */}
      <svg
        width={size}
        height={Math.round(size * 0.95)}
        viewBox="0 0 100 95"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id={gradId} cx="35%" cy="27%" r="68%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.5" />
            <stop offset="42%"  stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </radialGradient>
        </defs>
        {/* Bayangan balon */}
        <path
          d="M50 88 C25 65 5 48 5 28 C5 10 18 1 32 6 C39 9 45 14 50 20 C55 14 61 9 68 6 C82 1 95 10 95 28 C95 48 75 65 50 88Z"
          fill="rgba(0,0,0,0.1)"
          transform="translate(2,5)"
        />
        {/* Hati utama */}
        <path
          d="M50 88 C25 65 5 48 5 28 C5 10 18 1 32 6 C39 9 45 14 50 20 C55 14 61 9 68 6 C82 1 95 10 95 28 C95 48 75 65 50 88Z"
          fill={`url(#${gradId})`}
        />
        {/* Kilap */}
        <ellipse
          cx="33" cy="20" rx="11" ry="7"
          fill="white" opacity="0.42"
          transform="rotate(-35 33 20)"
        />
        {/* Bintik kilap kecil */}
        <ellipse cx="42" cy="28" rx="4" ry="2.5" fill="white" opacity="0.22" transform="rotate(-20 42 28)" />
        {/* Simpul bawah balon */}
        <ellipse cx="50" cy="90" rx="4" ry="3" fill={color} opacity="0.78" />
      </svg>

      {/* Tali + Kertas — bergoyang bersama (pivot di atas = titik simpul balon) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transformOrigin: "top center",
          animation: `stringWindSway ${swayDur}s ease-in-out ${Math.abs(delay) * 0.55}s infinite`,
        }}
      >
        {/* Tali */}
        <div
          style={{
            width: "2px",
            height: `${stringLen}px`,
            background: `linear-gradient(to bottom, ${color}99 0%, #c084b066 70%, #c084b033 100%)`,
            borderRadius: "1px",
            flexShrink: 0,
          }}
        />

        {/* Kertas — pivot mandiri di atas (titik tempel ke tali) */}
        <div
          style={{
            transformOrigin: "top center",
            animation: `noteWindSway ${noteSway}s ease-in-out ${Math.abs(delay) * 0.3}s infinite`,
          }}
        >
          <div
            style={{
              padding: "5px 9px 6px",
              background: "linear-gradient(148deg, #fff9fb 0%, #ffe4ef 100%)",
              border: "1px solid #f9a8c9",
              borderRadius: "4px",
              boxShadow:
                "0 3px 10px rgba(232,56,79,0.14), 0 1px 3px rgba(0,0,0,0.08)",
              position: "relative",
              overflow: "hidden",
              minWidth: "max-content",
            }}
          >
            {/* Garis kertas ruled */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 12px, rgba(249,168,201,0.3) 12px, rgba(249,168,201,0.3) 13px)",
              }}
            />
            {/* Teks */}
            <p
              style={{
                position: "relative",
                margin: 0,
                fontFamily: "'Pacifico', cursive",
                fontSize: `${noteFont}px`,
                color: "#e8384f",
                whiteSpace: "nowrap",
                textShadow: "0 1px 3px rgba(232,56,79,0.22)",
                lineHeight: 1.5,
              }}
            >
              Happy Birthday ♥
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BalloonBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {BALLOONS.map((b) => (
        <LoveBalloon key={b.id} {...b} />
      ))}
    </div>
  );
}

/**
 * SakuraBackground — Kelopak bunga sakura jatuh cantik dari atas ke bawah
 * Random posisi, ukuran, kecepatan, rotasi, dan jalur jatuh.
 */

const PETAL_COLORS = [
  "#ffb7c5",   // pink klasik sakura
  "#ffc8d5",   // pink muda
  "#ff8fab",   // pink medium
  "#ffdde6",   // pink sangat muda
  "#ffe0ea",   // hampir putih pink
  "#ffacc7",   // pink cerah
  "#fff0f4",   // putih pink
  "#ffa3bc",   // pink tua
];

interface PetalData {
  id: number;
  x: number;          // % dari kiri
  size: number;       // px
  color: string;
  duration: number;   // detik jatuh
  delay: number;      // detik (negatif = sudah berjalan)
  initRot: number;    // rotasi awal (deg)
  spinDur: number;    // detik spin
  pathIdx: number;    // jalur jatuh 0-4
  opacity: number;
}

// Generate di module level → hanya sekali, random permanen
const PETALS: PetalData[] = Array.from({ length: 45 }, (_, i) => {
  const dur = 6 + Math.random() * 9;          // 6–15 detik jatuh
  return {
    id: i,
    x: Math.random() * 100,                   // 0–100% (benar-benar random)
    size: 12 + Math.random() * 22,             // 12–34px
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    duration: dur,
    delay: -(dur * Math.random()),             // negatif → langsung terlihat
    initRot: Math.random() * 360,
    spinDur: 3 + Math.random() * 6,            // 3–9 detik per putaran
    pathIdx: Math.floor(Math.random() * 5),
    opacity: 0.65 + Math.random() * 0.35,     // 0.65–1.0
  };
});

// Sakura petal SVG — bentuk kelopak bunga yang realistis
function PetalSvg({ size, color, initRot, spinDur, delay }: {
  size: number; color: string; initRot: number; spinDur: number; delay: number;
}) {
  // Dua bentuk kelopak bergantian (rounded & sedikit lonjong)
  const w = size;
  const h = size * 1.25;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 40 50"
      style={{
        transform: `rotate(${initRot}deg)`,
        animation: `sakuraSpin ${spinDur}s linear ${delay}s infinite`,
        display: "block",
        filter: "drop-shadow(0 1px 2px rgba(255,133,161,0.25))",
      }}
    >
      <defs>
        <radialGradient id={`pg${Math.round(size * 10)}`} cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="60%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </radialGradient>
      </defs>
      {/* Kelopak utama — bentuk hati terbalik / oval dengan lekukan atas */}
      <path
        d={`
          M 20 4
          C 12 4, 4 12, 4 22
          C 4 34, 12 44, 20 47
          C 28 44, 36 34, 36 22
          C 36 12, 28 4, 20 4 Z
        `}
        fill={`url(#pg${Math.round(size * 10)})`}
        opacity="0.88"
      />
      {/* Lekukan di atas (notch khas kelopak sakura) */}
      <path
        d={`M 20 4 C 18 6, 17 8, 20 10 C 23 8, 22 6, 20 4 Z`}
        fill="white"
        opacity="0.35"
      />
      {/* Urat kelopak */}
      <path
        d={`M 20 10 L 20 40`}
        stroke="white"
        strokeWidth="0.8"
        opacity="0.25"
        strokeLinecap="round"
      />
      <path
        d={`M 20 18 C 14 22, 8 28, 6 34`}
        stroke="white"
        strokeWidth="0.6"
        opacity="0.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M 20 18 C 26 22, 32 28, 34 34`}
        stroke="white"
        strokeWidth="0.6"
        opacity="0.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Satu kelopak yang jatuh
function SakuraPetal(p: PetalData) {
  return (
    <div
      style={{
        position: "absolute",
        top: `-${p.size * 1.5}px`,
        left: `${p.x}%`,
        opacity: p.opacity,
        animation: `sakuraFall${p.pathIdx + 1} ${p.duration}s ease-in ${p.delay}s infinite`,
        willChange: "transform",
        pointerEvents: "none",
      }}
    >
      <PetalSvg
        size={p.size}
        color={p.color}
        initRot={p.initRot}
        spinDur={p.spinDur}
        delay={p.delay}
      />
    </div>
  );
}

export default function SakuraBackground() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {PETALS.map((p) => (
          <SakuraPetal key={p.id} {...p} />
        ))}
      </div>

      {/* Keyframes inline untuk 5 jalur + spin */}
      <style>{`
        @keyframes sakuraSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Jalur 1 — drift kanan lalu kiri */
        @keyframes sakuraFall1 {
          0%   { transform: translateY(0)    translateX(0);    opacity: 0; }
          5%   { opacity: 1; }
          20%  { transform: translateY(22vh) translateX(35px); }
          40%  { transform: translateY(42vh) translateX(10px); }
          60%  { transform: translateY(62vh) translateX(45px); }
          80%  { transform: translateY(82vh) translateX(15px); }
          95%  { opacity: 0.7; }
          100% { transform: translateY(108vh) translateX(30px); opacity: 0; }
        }
        /* Jalur 2 — drift kiri lalu kanan */
        @keyframes sakuraFall2 {
          0%   { transform: translateY(0)    translateX(0);     opacity: 0; }
          5%   { opacity: 1; }
          20%  { transform: translateY(20vh) translateX(-40px); }
          40%  { transform: translateY(42vh) translateX(-8px);  }
          60%  { transform: translateY(63vh) translateX(-50px); }
          80%  { transform: translateY(83vh) translateX(-18px); }
          95%  { opacity: 0.8; }
          100% { transform: translateY(108vh) translateX(-35px); opacity: 0; }
        }
        /* Jalur 3 — zigzag halus */
        @keyframes sakuraFall3 {
          0%   { transform: translateY(0)    translateX(0);    opacity: 0; }
          8%   { opacity: 1; }
          15%  { transform: translateY(15vh) translateX(25px); }
          30%  { transform: translateY(30vh) translateX(-15px);}
          50%  { transform: translateY(50vh) translateX(30px); }
          70%  { transform: translateY(70vh) translateX(-20px);}
          88%  { opacity: 0.7; }
          100% { transform: translateY(108vh) translateX(10px); opacity: 0; }
        }
        /* Jalur 4 — lambat, swing lebar */
        @keyframes sakuraFall4 {
          0%   { transform: translateY(0)    translateX(0);    opacity: 0; }
          6%   { opacity: 1; }
          25%  { transform: translateY(22vh) translateX(-55px);}
          50%  { transform: translateY(50vh) translateX(55px); }
          75%  { transform: translateY(75vh) translateX(-40px);}
          92%  { opacity: 0.6; }
          100% { transform: translateY(108vh) translateX(25px); opacity: 0; }
        }
        /* Jalur 5 — nyaris lurus, sedikit sway */
        @keyframes sakuraFall5 {
          0%   { transform: translateY(0)    translateX(0);    opacity: 0; }
          7%   { opacity: 1; }
          30%  { transform: translateY(30vh) translateX(12px); }
          55%  { transform: translateY(55vh) translateX(-8px); }
          80%  { transform: translateY(80vh) translateX(15px); }
          93%  { opacity: 0.75; }
          100% { transform: translateY(108vh) translateX(-5px); opacity: 0; }
        }
      `}</style>
    </>
  );
}

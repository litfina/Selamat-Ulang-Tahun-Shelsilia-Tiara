import { useState, useEffect, useCallback } from "react";
import SakuraBackground from "../components/SakuraBackground";

interface WelcomeSceneProps {
  onOpenEnvelope: () => void;
}


export default function WelcomeScene({ onOpenEnvelope }: WelcomeSceneProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [phase, setPhase] = useState<"idle" | "lifting" | "flap" | "letter" | "done">("idle");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);
    setPhase("lifting");

    setTimeout(() => setPhase("flap"), 400);
    setTimeout(() => setPhase("letter"), 900);
    setTimeout(() => setPhase("done"), 1600);
    setTimeout(() => {
      onOpenEnvelope();
    }, 1800);
  }, [isOpening, onOpenEnvelope]);

  const envelopeW = 300;
  const envelopeH = 200;

  return (
    <div className="fixed inset-0 gradient-pink flex flex-col items-center justify-center overflow-hidden">
      {/* 🌸 Sakura petals jatuh dari atas */}
      <SakuraBackground />

      {/* Title — "Happy Birthday" in pink Pacifico */}
      <h1
        className={`relative z-10 text-5xl md:text-7xl mb-10 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        }`}
        style={{
          fontFamily: "'Pacifico', cursive",
          color: "#e8384f",
          textShadow:
            "0 2px 12px rgba(232,56,79,0.35), 0 4px 24px rgba(255,105,157,0.25)",
          letterSpacing: "0.02em",
        }}
      >
        Happy Birthday
      </h1>

      {/* Envelope */}
      <div
        className={`relative z-10 cursor-pointer transition-all duration-700 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        onClick={handleClick}
      >
        <div
          style={{
            animation:
              phase === "idle" ? "float 3s ease-in-out infinite" : "none",
            transform:
              phase === "lifting"
                ? "scale(1.08) translateY(-12px)"
                : phase === "done"
                ? "scale(1.18) translateY(-20px)"
                : undefined,
            transition: "transform 0.5s ease",
          }}
        >
          {/* 3D Envelope container */}
          <div
            style={{
              width: envelopeW,
              height: envelopeH + (phase === "letter" || phase === "done" ? 60 : 0),
              position: "relative",
              perspective: "800px",
              transition: "height 0.5s ease",
            }}
          >
            {/* Letter peeking out */}
            {(phase === "letter" || phase === "done") && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  transform: "translateX(-50%) translateY(-60px)",
                  width: envelopeW - 40,
                  background: "#fff9f5",
                  borderRadius: "6px 6px 2px 2px",
                  padding: "10px 16px",
                  boxShadow: "0 -4px 16px rgba(232,56,79,0.18)",
                  border: "1px solid #f9a8c9",
                  zIndex: 1,
                  animation: "letterPeek 0.5s ease forwards",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Pacifico', cursive",
                    color: "#e8384f",
                    fontSize: "16px",
                    margin: 0,
                  }}
                >
                  Happy Birthday! 🎉
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "#9b4467",
                    fontSize: "12px",
                    marginTop: "4px",
                    fontStyle: "italic",
                  }}
                >
                  ♥ ada pesan untukmu...
                </p>
              </div>
            )}

            {/* SVG Envelope — larger, more realistic */}
            <svg
              width={envelopeW}
              height={envelopeH}
              viewBox={`0 0 ${envelopeW} ${envelopeH}`}
              className="drop-shadow-2xl"
              style={{ position: "relative", zIndex: 2 }}
            >
              <defs>
                <linearGradient id="envBodyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5e6d0" />
                  <stop offset="100%" stopColor="#ecdbc0" />
                </linearGradient>
                <linearGradient id="envFlapGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5e6d0" />
                  <stop offset="100%" stopColor="#e8d5bb" />
                </linearGradient>
                <filter id="envShadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.15)" />
                </filter>
              </defs>

              {/* Envelope body */}
              <rect
                x="10" y="10"
                width={envelopeW - 20}
                height={envelopeH - 20}
                rx="6"
                fill="url(#envBodyGrad)"
                stroke="#d4c4a8"
                strokeWidth="1.5"
                filter="url(#envShadow)"
              />

              {/* Left side flap */}
              <polygon
                points={`10,10 ${envelopeW / 2},${envelopeH / 2} 10,${envelopeH - 10}`}
                fill="#e8dcca"
                stroke="#d4c4a8"
                strokeWidth="0.8"
              />
              {/* Right side flap */}
              <polygon
                points={`${envelopeW - 10},10 ${envelopeW / 2},${envelopeH / 2} ${envelopeW - 10},${envelopeH - 10}`}
                fill="#e8dcca"
                stroke="#d4c4a8"
                strokeWidth="0.8"
              />
              {/* Bottom flap */}
              <polygon
                points={`10,${envelopeH - 10} ${envelopeW / 2},${envelopeH / 2} ${envelopeW - 10},${envelopeH - 10}`}
                fill="#e0d5c0"
                stroke="#d4c4a8"
                strokeWidth="0.8"
              />

              {/* Top flap — 3D realistic open */}
              <g
                style={{
                  transformOrigin: `${envelopeW / 2}px 10px`,
                  transform:
                    phase === "flap" || phase === "letter" || phase === "done"
                      ? "rotateX(-160deg)"
                      : "rotateX(0deg)",
                  transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <polygon
                  points={`10,10 ${envelopeW / 2},${envelopeH * 0.6} ${envelopeW - 10},10`}
                  fill="url(#envFlapGrad)"
                  stroke="#d4c4a8"
                  strokeWidth="0.8"
                />
                {/* Inner flap shadow when open */}
                {(phase === "flap" || phase === "letter" || phase === "done") && (
                  <polygon
                    points={`10,10 ${envelopeW / 2},${envelopeH * 0.6} ${envelopeW - 10},10`}
                    fill="rgba(0,0,0,0.06)"
                  />
                )}
              </g>

              {/* Seal (wax) — hides when opening */}
              <g
                style={{
                  opacity: phase === "idle" || phase === "lifting" ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                {/* Wax seal circle */}
                <circle cx={envelopeW / 2} cy={envelopeH / 2 + 8} r="28" fill="#c2185b" opacity="0.92" />
                <circle cx={envelopeW / 2} cy={envelopeH / 2 + 8} r="23" fill="#e8384f" opacity="0.95" />
                {/* Heart on seal */}
                <path
                  d={`M${envelopeW / 2} ${envelopeH / 2 + 20}
                    C${envelopeW / 2} ${envelopeH / 2 + 20}
                    ${envelopeW / 2 - 11} ${envelopeH / 2 + 12}
                    ${envelopeW / 2 - 11} ${envelopeH / 2 + 4}
                    C${envelopeW / 2 - 11} ${envelopeH / 2 - 1}
                    ${envelopeW / 2 - 7} ${envelopeH / 2 - 4}
                    ${envelopeW / 2} ${envelopeH / 2 + 1}
                    C${envelopeW / 2 + 7} ${envelopeH / 2 - 4}
                    ${envelopeW / 2 + 11} ${envelopeH / 2 - 1}
                    ${envelopeW / 2 + 11} ${envelopeH / 2 + 4}
                    C${envelopeW / 2 + 11} ${envelopeH / 2 + 12}
                    ${envelopeW / 2} ${envelopeH / 2 + 20}
                    ${envelopeW / 2} ${envelopeH / 2 + 20}Z`}
                  fill="white"
                  opacity="0.9"
                />
                {/* Seal shine */}
                <ellipse cx={envelopeW / 2 - 7} cy={envelopeH / 2 + 2} rx="5" ry="3" fill="white" opacity="0.2" transform={`rotate(-30, ${envelopeW / 2 - 7}, ${envelopeH / 2 + 2})`} />
              </g>

              {/* Postage stamp top-right */}
              <rect x={envelopeW - 55} y="18" width="30" height="24" rx="2" fill="#fff8f0" stroke="#d4c4a8" strokeWidth="1" strokeDasharray="2,1.5" />
              <text x={envelopeW - 40} y="34" textAnchor="middle" fontSize="10" fill="#e8384f">♥</text>
            </svg>
          </div>

          {/* Glow behind envelope */}
          <div
            className="absolute inset-0 -z-10 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, #ffb6c9 0%, transparent 65%)",
              transform: "scale(1.6)",
              opacity: phase === "idle" ? 0.3 : 0.5,
              transition: "opacity 0.5s ease",
            }}
          />
        </div>

        {/* Click hint */}
        <p
          className={`text-center mt-6 font-ui text-sm text-[#4a2c3f]/60 transition-all duration-500 ${
            isOpening ? "opacity-0" : "opacity-100"
          }`}
          style={{
            animation: isOpening ? "none" : "blink 2s ease-in-out infinite",
          }}
        >
          ✉️ klik untuk membuka amplop
        </p>
      </div>

      {/* Butterflies */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <svg
            key={i}
            width="32"
            height="26"
            viewBox="0 0 30 24"
            className="absolute"
            style={{
              animation: `butterfly-fly ${15 + i * 5}s linear ${i * 7}s infinite`,
              opacity: 0.35,
            }}
          >
            <path
              d="M15 12 Q8 4 3 8 Q2 14 8 16 Q12 14 15 12 Q18 14 22 16 Q28 14 27 8 Q22 4 15 12"
              fill={i % 2 === 0 ? "#ffb6c9" : "#dda0dd"}
              opacity="0.6"
            />
          </svg>
        ))}
      </div>

      <style>{`
        @keyframes letterPeek {
          from { opacity: 0; transform: translateX(-50%) translateY(-40px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(-60px); }
        }
      `}</style>
    </div>
  );
}

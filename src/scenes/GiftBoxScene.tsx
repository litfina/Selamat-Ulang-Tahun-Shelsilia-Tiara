import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

interface GiftBoxSceneProps {
  onComplete: () => void;
}

export default function GiftBoxScene({ onComplete }: GiftBoxSceneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible && !isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isOpen]);

  useEffect(() => {
    if (isOpen && !triggeredRef.current) {
      triggeredRef.current = true;

      // Confetti burst
      const duration = 1500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          startVelocity: 30,
          spread: 360,
          origin: { x: 0.5, y: 0.5 },
          colors: ["#e8384f", "#ffb6c9", "#b98b3d", "#ffffff", "#ff69b4"],
          shapes: ["circle", "square"],
          scalar: Math.random() * 0.8 + 0.5,
          ticks: 200,
          gravity: 0.8,
          drift: 0,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          setTimeout(() => {
            onComplete();
          }, 500);
        }
      };

      frame();
    }
  }, [isOpen, onComplete]);

  return (
    <div className="fixed inset-0 gradient-pink flex items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 182, 201, 0.4) 0%, transparent 60%)",
        }}
      />

      <div
        className={`relative z-10 transition-all duration-700 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        {/* 3D Gift Box */}
        <div
          style={{
            perspective: "800px",
            width: "160px",
            height: "160px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "160px",
              height: "160px",
              transformStyle: "preserve-3d",
              transform: "rotateX(-15deg) rotateY(25deg)",
              transition: "transform 0.5s ease",
            }}
          >
            {/* Box body */}
            {/* Front face */}
            <div
              style={{
                position: "absolute",
                width: "160px",
                height: "120px",
                background: "linear-gradient(135deg, #ffb6c9 0%, #ff9eb5 100%)",
                transform: "translateZ(80px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              {/* Ribbon vertical */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: "24px",
                  transform: "translateX(-50%)",
                  background:
                    "linear-gradient(90deg, #b98b3d 0%, #d4a84c 50%, #b98b3d 100%)",
                }}
              />
            </div>
            {/* Back face */}
            <div
              style={{
                position: "absolute",
                width: "160px",
                height: "120px",
                background: "linear-gradient(135deg, #ff9eb5 0%, #ff85a2 100%)",
                transform: "rotateY(180deg) translateZ(80px)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: "24px",
                  transform: "translateX(-50%)",
                  background:
                    "linear-gradient(90deg, #a67c35 0%, #b98b3d 50%, #a67c35 100%)",
                }}
              />
            </div>
            {/* Left face */}
            <div
              style={{
                position: "absolute",
                width: "160px",
                height: "120px",
                background: "linear-gradient(135deg, #ffd6e3 0%, #ffb6c9 100%)",
                transform: "rotateY(-90deg) translateZ(80px)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: "24px",
                  transform: "translateX(-50%)",
                  background:
                    "linear-gradient(90deg, #c9a04f 0%, #d4a84c 50%, #c9a04f 100%)",
                }}
              />
            </div>
            {/* Right face */}
            <div
              style={{
                position: "absolute",
                width: "160px",
                height: "120px",
                background: "linear-gradient(135deg, #ff85a2 0%, #ff6b8a 100%)",
                transform: "rotateY(90deg) translateZ(80px)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: "24px",
                  transform: "translateX(-50%)",
                  background:
                    "linear-gradient(90deg, #a67c35 0%, #b98b3d 50%, #a67c35 100%)",
                }}
              />
            </div>
            {/* Bottom face */}
            <div
              style={{
                position: "absolute",
                width: "160px",
                height: "160px",
                background: "linear-gradient(135deg, #ffd6e3 0%, #ffc4d6 100%)",
                transform: "rotateX(-90deg) translateZ(40px)",
              }}
            />

            {/* Lid */}
            <div
              style={{
                position: "absolute",
                width: "170px",
                height: "170px",
                left: "-5px",
                top: "-25px",
                transformStyle: "preserve-3d",
                transformOrigin: "top center",
                transform: isOpen
                  ? "rotateX(-110deg) translateY(-5px)"
                  : "rotateX(0deg) translateY(0px)",
                transition: "transform 0.8s ease",
              }}
            >
              {/* Lid top */}
              <div
                style={{
                  position: "absolute",
                  width: "170px",
                  height: "170px",
                  background: "linear-gradient(135deg, #ffeef2 0%, #ffd6e3 100%)",
                  transform: "rotateX(90deg) translateZ(85px)",
                  boxShadow: isOpen
                    ? "none"
                    : "0 4px 20px rgba(0,0,0,0.15)",
                }}
              >
                {/* Bow on top */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <svg width="50" height="40" viewBox="0 0 50 40">
                    <path
                      d="M25 20 Q15 8 8 14 Q5 20 12 24 Q18 26 25 20 Q32 26 38 24 Q45 20 42 14 Q35 8 25 20"
                      fill="#b98b3d"
                    />
                    <circle cx="25" cy="20" r="4" fill="#d4a84c" />
                    <path
                      d="M25 24 Q22 32 20 38"
                      stroke="#b98b3d"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M25 24 Q28 32 30 38"
                      stroke="#b98b3d"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {/* Ribbon cross on lid */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    bottom: 0,
                    width: "24px",
                    transform: "translateX(-50%)",
                    background:
                      "linear-gradient(90deg, #b98b3d 0%, #d4a84c 50%, #b98b3d 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    height: "24px",
                    transform: "translateY(-50%)",
                    background:
                      "linear-gradient(180deg, #b98b3d 0%, #d4a84c 50%, #b98b3d 100%)",
                  }}
                />
              </div>
              {/* Lid sides */}
              <div
                style={{
                  position: "absolute",
                  width: "170px",
                  height: "20px",
                  background:
                    "linear-gradient(135deg, #ffd6e3 0%, #ffb6c9 100%)",
                  transform: "translateZ(85px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "170px",
                  height: "20px",
                  background:
                    "linear-gradient(135deg, #ffb6c9 0%, #ff9eb5 100%)",
                  transform: "rotateY(180deg) translateZ(85px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "170px",
                  height: "20px",
                  background:
                    "linear-gradient(135deg, #ffeef2 0%, #ffd6e3 100%)",
                  transform: "rotateY(-90deg) translateZ(85px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "170px",
                  height: "20px",
                  background:
                    "linear-gradient(135deg, #ff9eb5 0%, #ff85a2 100%)",
                  transform: "rotateY(90deg) translateZ(85px)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Surprise text */}
        <p
          className={`text-center mt-10 font-display text-2xl text-glow-gold transition-all duration-700 ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="gold-shimmer">Surprise!</span>
        </p>
      </div>
    </div>
  );
}

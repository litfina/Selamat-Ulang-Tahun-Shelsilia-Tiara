import { useState, useEffect, useRef, useCallback } from "react";
import { Heart } from "lucide-react";
import FireflyParticles from "../components/FireflyParticles";
import PolaroidGallery from "../components/PolaroidGallery";
import { CONFIG } from "../config";

export default function LetterScene() {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<
    { id: number; x: number; delay: number }[]
  >([]);
  const typingIndexRef = useRef(0);
  const fullTextRef = useRef(CONFIG.letterContent);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Typing effect
  useEffect(() => {
    if (!isVisible) return;

    const text = fullTextRef.current;
    typingIndexRef.current = 0;
    setDisplayedText("");
    setIsTypingComplete(false);

    const typeInterval = setInterval(() => {
      if (typingIndexRef.current < text.length) {
        const next = text.charAt(typingIndexRef.current);
        setDisplayedText((prev) => prev + next);
        typingIndexRef.current++;
      } else {
        clearInterval(typeInterval);
        setIsTypingComplete(true);
      }
    }, 45);

    return () => clearInterval(typeInterval);
  }, [isVisible]);

  const handleReplyClick = useCallback(() => {
    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 60 - 30,
      delay: i * 0.1,
    }));
    setFloatingHearts((prev) => [...prev, ...newHearts]);

    // Clean up after animation
    setTimeout(() => {
      setFloatingHearts((prev) =>
        prev.filter((h) => !newHearts.find((nh) => nh.id === h.id))
      );
    }, 3000);
  }, []);

  return (
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden">
      {/* Background with blur */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${CONFIG.letterBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.9)",
          transform: "scale(1.1)",
        }}
      />
      {/* Pink overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 182, 201, 0.3) 0%, rgba(255, 214, 227, 0.2) 100%)",
        }}
      />

      <FireflyParticles />

      {/* Content */}
      <div
        className={`relative z-10 min-h-screen flex flex-col items-center py-8 px-4 transition-all duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Letter Panel */}
        <div
          className={`w-full max-w-xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div
            className="relative rounded-lg shadow-2xl overflow-hidden"
            style={{
              background: "#fbf3e3",
              transform: "rotate(0.5deg)",
            }}
          >
            {/* Ruled paper lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 31px, rgba(185, 139, 61, 0.12) 31px, rgba(185, 139, 61, 0.12) 32px)",
                backgroundSize: "100% 32px",
              }}
            />

            {/* Corner ornaments */}
            <svg
              className="absolute top-2 left-2 w-12 h-12 pointer-events-none opacity-40"
              viewBox="0 0 48 48"
            >
              <path
                d="M4 4 Q4 20 4 36 Q20 36 36 36 Q36 20 36 4 Q20 4 4 4"
                fill="none"
                stroke="#b98b3d"
                strokeWidth="1"
              />
              <circle cx="8" cy="8" r="2" fill="#b98b3d" opacity="0.5" />
              <path
                d="M8 12 Q12 8 16 8 Q12 12 8 16 Q8 12 8 12"
                fill="#b98b3d"
                opacity="0.3"
              />
            </svg>
            <svg
              className="absolute top-2 right-2 w-12 h-12 pointer-events-none opacity-40"
              viewBox="0 0 48 48"
              style={{ transform: "scaleX(-1)" }}
            >
              <path
                d="M4 4 Q4 20 4 36 Q20 36 36 36 Q36 20 36 4 Q20 4 4 4"
                fill="none"
                stroke="#b98b3d"
                strokeWidth="1"
              />
              <circle cx="8" cy="8" r="2" fill="#b98b3d" opacity="0.5" />
              <path
                d="M8 12 Q12 8 16 8 Q12 12 8 16 Q8 12 8 12"
                fill="#b98b3d"
                opacity="0.3"
              />
            </svg>
            <svg
              className="absolute bottom-2 left-2 w-12 h-12 pointer-events-none opacity-40"
              viewBox="0 0 48 48"
              style={{ transform: "scaleY(-1)" }}
            >
              <path
                d="M4 4 Q4 20 4 36 Q20 36 36 36 Q36 20 36 4 Q20 4 4 4"
                fill="none"
                stroke="#b98b3d"
                strokeWidth="1"
              />
              <circle cx="8" cy="8" r="2" fill="#b98b3d" opacity="0.5" />
              <path
                d="M8 12 Q12 8 16 8 Q12 12 8 16 Q8 12 8 12"
                fill="#b98b3d"
                opacity="0.3"
              />
            </svg>
            <svg
              className="absolute bottom-2 right-2 w-12 h-12 pointer-events-none opacity-40"
              viewBox="0 0 48 48"
              style={{ transform: "scale(-1, -1)" }}
            >
              <path
                d="M4 4 Q4 20 4 36 Q20 36 36 36 Q36 20 36 4 Q20 4 4 4"
                fill="none"
                stroke="#b98b3d"
                strokeWidth="1"
              />
              <circle cx="8" cy="8" r="2" fill="#b98b3d" opacity="0.5" />
              <path
                d="M8 12 Q12 8 16 8 Q12 12 8 16 Q8 12 8 12"
                fill="#b98b3d"
                opacity="0.3"
              />
            </svg>

            {/* Letter content */}
            <div className="relative z-10 p-8 md:p-12">
              {/* Title */}
              <h2 className="font-letter text-2xl md:text-3xl text-[#4a2c3f] mb-6 italic text-center">
                {CONFIG.letterTitle}
              </h2>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-16 h-px bg-[#b98b3d]/30" />
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#e8384f" opacity="0.5">
                  <path d="M8 15 L2 9 C0 7 0 4 2 2 C4 0 7 1 8 4 C9 1 12 0 14 2 C16 4 16 7 14 9 Z" />
                </svg>
                <div className="w-16 h-px bg-[#b98b3d]/30" />
              </div>

              {/* Letter body with typing effect */}
              <div
                className="font-letter text-base md:text-lg text-[#4a2c3f] leading-[32px] whitespace-pre-line min-h-[200px]"
              >
                {displayedText}
                {!isTypingComplete && (
                  <span className="inline-block w-0.5 h-5 bg-[#e8384f] ml-0.5 animate-pulse" />
                )}
              </div>

              {/* Closing */}
              {isTypingComplete && (
                <div
                  className="mt-8 text-right transition-all duration-700"
                  style={{
                    animation: "fadeIn 1s ease forwards",
                  }}
                >
                  <p className="font-letter text-[#4a2c3f] italic">
                    {CONFIG.letterClosing}
                  </p>
                  <p className="font-letter text-xl text-[#4a2c3f] italic mt-2 font-semibold">
                    {CONFIG.letterSender}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Polaroid Gallery */}
        <div
          className={`mt-8 w-full max-w-md mx-auto transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <PolaroidGallery />
        </div>


        {/* Reply Button */}
        <div
          className={`mt-8 mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: isVisible ? "1200ms" : "0ms" }}
        >
          <button
            onClick={handleReplyClick}
            className="relative px-6 py-3 rounded-full glass-pink text-[#4a2c3f] font-ui text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <span className="flex items-center gap-2">
              <Heart size={16} className="text-[#e8384f]" />
              Kirim Balasan / Ucapan Terima Kasih
            </span>

            {/* Floating hearts on click */}
            {floatingHearts.map((h) => (
              <Heart
                key={h.id}
                size={16}
                className="absolute text-[#e8384f] pointer-events-none"
                style={{
                  left: "50%",
                  bottom: "100%",
                  animation: `firefly 2s ease-out ${h.delay}s forwards`,
                  transform: `translateX(${h.x}px)`,
                  opacity: 0,
                }}
                fill="#e8384f"
              />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}

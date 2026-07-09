import { useEffect, useRef } from "react";

interface Sparkle {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function SparkleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkles = useRef<Sparkle[]>([]);

  useEffect(() => {
    const generated: Sparkle[] = [];
    for (let i = 0; i < 50; i++) {
      generated.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 4,
        duration: Math.random() * 2 + 2,
      });
    }
    sparkles.current = generated;
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      generated.forEach((s) => {
        const dot = document.createElement("div");
        dot.className = "absolute rounded-full bg-white pointer-events-none";
        dot.style.left = `${s.x}%`;
        dot.style.top = `${s.y}%`;
        dot.style.width = `${s.size}px`;
        dot.style.height = `${s.size}px`;
        dot.style.animation = `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`;
        dot.style.opacity = "0";
        dot.style.boxShadow = `0 0 ${s.size * 2}px rgba(255, 255, 255, 0.8)`;
        containerRef.current?.appendChild(dot);
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
}

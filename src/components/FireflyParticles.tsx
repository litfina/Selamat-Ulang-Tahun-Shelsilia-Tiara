import { useEffect, useRef } from "react";

interface Firefly {
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
}

export default function FireflyParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fireflies: Firefly[] = [];
    for (let i = 0; i < 25; i++) {
      fireflies.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6,
        duration: Math.random() * 4 + 4,
        size: Math.random() * 4 + 2,
      });
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      fireflies.forEach((f) => {
        const dot = document.createElement("div");
        dot.className = "absolute rounded-full pointer-events-none";
        dot.style.left = `${f.x}%`;
        dot.style.top = `${f.y}%`;
        dot.style.width = `${f.size}px`;
        dot.style.height = `${f.size}px`;
        dot.style.background = "rgba(255, 240, 180, 0.9)";
        dot.style.boxShadow = `0 0 ${f.size * 3}px rgba(255, 240, 180, 0.6), 0 0 ${f.size * 6}px rgba(255, 220, 120, 0.3)`;
        dot.style.animation = `firefly ${f.duration}s ease-in-out ${f.delay}s infinite`;
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

import { useEffect, useRef } from "react";

interface Balloon {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
}

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

const BALLOON_COLORS = [
  "#e8384f", // red
  "#ffb6c9", // light pink
  "#ff69b4", // hot pink
  "#da70d6", // orchid
  "#dda0dd", // plum
];

export default function FloatingElements() {
  const balloonsRef = useRef<Balloon[]>([]);
  const petalsRef = useRef<Petal[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate balloons
    const balloons: Balloon[] = [];
    for (let i = 0; i < 12; i++) {
      balloons.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 10,
        duration: Math.random() * 8 + 12,
        size: Math.random() * 40 + 20,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      });
    }
    balloonsRef.current = balloons;

    // Generate petals
    const petals: Petal[] = [];
    for (let i = 0; i < 20; i++) {
      petals.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: Math.random() * 6 + 8,
        size: Math.random() * 8 + 4,
      });
    }
    petalsRef.current = petals;

    // Render elements
    if (containerRef.current) {
      containerRef.current.innerHTML = "";

      // Render balloons
      balloons.forEach((b) => {
        const el = document.createElement("div");
        el.className = "absolute pointer-events-none";
        el.style.left = `${b.x}%`;
        el.style.bottom = "-80px";
        el.style.animation = `drift-up ${b.duration}s linear ${b.delay}s infinite`;
        el.innerHTML = `
          <svg width="${b.size}" height="${b.size * 1.2}" viewBox="0 0 30 36" fill="${b.color}" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">
            <path d="M15 35.5C15 35.5 2 25 2 14C2 7.5 7 2.5 13 2.5C15 2.5 15 4 15 4C15 4 15 2.5 17 2.5C23 2.5 28 7.5 28 14C28 25 15 35.5 15 35.5Z" opacity="0.85"/>
            <line x1="15" y1="35" x2="15" y2="38" stroke="${b.color}" stroke-width="1" opacity="0.5"/>
          </svg>
        `;
        containerRef.current?.appendChild(el);
      });

      // Render petals
      petals.forEach((p) => {
        const el = document.createElement("div");
        el.className = "absolute pointer-events-none rounded-full";
        el.style.left = `${p.x}%`;
        el.style.top = "-20px";
        el.style.width = `${p.size}px`;
        el.style.height = `${p.size}px`;
        el.style.background = `rgba(255, 182, 201, ${Math.random() * 0.5 + 0.3})`;
        el.style.borderRadius = "50% 0 50% 50%";
        el.style.transform = `rotate(${Math.random() * 360}deg)`;
        el.style.animation = `drift-up ${p.duration}s linear ${p.delay}s infinite`;
        containerRef.current?.appendChild(el);
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

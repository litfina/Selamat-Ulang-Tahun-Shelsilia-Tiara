import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CONFIG } from "../config";

const ROTATIONS = [-3, 2, -2, 3];

export default function PolaroidGallery() {
  const [current, setCurrent] = useState(0);
  const photos = CONFIG.photos;

  const prev = () => setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1));

  return (
    <div className="relative w-full max-w-xs mx-auto">
      <div className="relative h-[320px] flex items-center justify-center">
        {photos.map((photo, idx) => {
          const offset = idx - current;
          const isActive = idx === current;

          return (
            <div
              key={idx}
              className="absolute polaroid transition-all duration-500 ease-out cursor-pointer"
              style={{
                transform: `
                  translateX(${offset * 40}px)
                  translateZ(${isActive ? 0 : -50}px)
                  rotate(${ROTATIONS[idx]}deg)
                  scale(${isActive ? 1 : 0.85})
                `,
                opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.5,
                zIndex: isActive ? 10 : 5 - Math.abs(offset),
              }}
              onClick={() => setCurrent(idx)}
            >
              <img
                src={photo}
                alt={`Memory ${idx + 1}`}
                className="w-[200px] h-[200px] object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="font-ui text-xs text-[#4a2c3f]/50">
                  #{idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          onClick={prev}
          className="p-2 rounded-full bg-white/80 shadow-md hover:bg-white hover:scale-110 transition-all"
          aria-label="Previous photo"
        >
          <ChevronLeft size={18} className="text-[#e8384f]" />
        </button>

        <div className="flex gap-2">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === current
                  ? "bg-[#e8384f] w-4"
                  : "bg-pink-300 hover:bg-pink-400"
              }`}
              aria-label={`Go to photo ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-2 rounded-full bg-white/80 shadow-md hover:bg-white hover:scale-110 transition-all"
          aria-label="Next photo"
        >
          <ChevronRight size={18} className="text-[#e8384f]" />
        </button>
      </div>
    </div>
  );
}

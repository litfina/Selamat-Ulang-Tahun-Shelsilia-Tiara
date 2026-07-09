import { useState, useEffect, useRef } from "react";
import { CONFIG } from "../config";
import BalloonBackground from "../components/BalloonBackground";

interface LoginSceneProps {
  onLogin: () => void;
}


// ─── Login Scene ──────────────────────────────────────────────────────────
export default function LoginScene({ onLogin }: LoginSceneProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) { setError("Masukkan username"); return; }
    if (!password.trim()) { setError("Masukkan password"); return; }
    if (password !== CONFIG.login.password) { setError("Password salah, coba lagi"); return; }
    onLogin();
  };

  return (
    <div className="fixed inset-0 gradient-pink flex items-center justify-center overflow-hidden">

      {/* ── Balon naik dari bawah ── */}
      <BalloonBackground />

      {/* ── Sparkle dots ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${(i * 5.7) % 100}%`,
              top: `${(i * 8.1) % 100}%`,
              background: "#e8384f",
              opacity: 0.15 + (i % 5) * 0.05,
              animation: `sparkle ${2 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Login card ── */}
      <div
        ref={cardRef}
        className={`relative z-10 w-full max-w-sm mx-4 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div
          className="glass-pink rounded-3xl p-8 glow-pink"
          style={{ animation: "float 4s ease-in-out infinite" }}
        >
          {/* Heart pattern overlay */}
          <div
            className="absolute inset-0 rounded-3xl opacity-10 pointer-events-none overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='%23e8384f'/%3E%3C/svg%3E")`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10">
            {/* Heartbeat icon */}
            <div className="flex justify-center mb-5">
              <svg
                width="88"
                height="82"
                viewBox="0 0 90 84"
                style={{
                  animation: "heartbeat 1.2s ease-in-out infinite",
                  filter: "drop-shadow(0 4px 14px rgba(232,56,79,0.55))",
                }}
              >
                <defs>
                  <radialGradient id="hgCard" cx="38%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ffb3cc" />
                    <stop offset="50%" stopColor="#e8384f" />
                    <stop offset="100%" stopColor="#b5103a" />
                  </radialGradient>
                </defs>
                <path
                  d="M45 78 C45 78 5 50 5 26 C5 13 14 4 26 4 C33 4 39 8 45 15 C51 8 57 4 64 4 C76 4 85 13 85 26 C85 50 45 78 45 78Z"
                  fill="url(#hgCard)"
                />
                <ellipse cx="32" cy="18" rx="9" ry="5.5" fill="white" opacity="0.28" transform="rotate(-30 32 18)" />
              </svg>
            </div>

            {/* Title */}
            <p className="font-ui text-sm text-center text-[#4a2c3f]/80 mb-6 font-semibold tracking-wide">
              Masukan Username dan Password
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <svg width="16" height="15" viewBox="0 0 16 15" fill="#f472b6">
                    <path d="M8 14 C8 14 1 9 1 4.5 C1 2 2.8 0.5 5 0.5 C6.2 0.5 7.2 1.2 8 2.2 C8.8 1.2 9.8 0.5 11 0.5 C13.2 0.5 15 2 15 4.5 C15 9 8 14 8 14Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Masukan Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 bg-white/80 font-ui text-sm text-[#4a2c3f] placeholder:text-pink-300 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
                  style={{
                    borderRadius: "50px 50px 40px 40px / 50px 50px 40px 40px",
                    boxShadow: "0 2px 8px rgba(244,114,182,0.15)",
                  }}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <svg width="16" height="15" viewBox="0 0 16 15" fill="#e8384f">
                    <path d="M8 14 C8 14 1 9 1 4.5 C1 2 2.8 0.5 5 0.5 C6.2 0.5 7.2 1.2 8 2.2 C8.8 1.2 9.8 0.5 11 0.5 C13.2 0.5 15 2 15 4.5 C15 9 8 14 8 14Z" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Masukan Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 bg-white/80 font-ui text-sm text-[#4a2c3f] placeholder:text-pink-300 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all"
                  style={{
                    borderRadius: "50px 50px 40px 40px / 50px 50px 40px 40px",
                    boxShadow: "0 2px 8px rgba(244,114,182,0.15)",
                  }}
                />
              </div>

              {error && (
                <p className="text-center text-xs text-red-500 font-ui animate-pulse">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 text-white font-ui font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{
                  background: "linear-gradient(135deg, #ff85b3 0%, #e8384f 100%)",
                  borderRadius: "50px 50px 40px 40px / 50px 50px 40px 40px",
                  boxShadow: "0 4px 15px rgba(232,56,79,0.4)",
                }}
              >
                Masuk ♥
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, SkipForward, SkipBack, Music2, ChevronDown, Volume2, VolumeX } from "lucide-react";
import { CONFIG } from "../config";

interface MusicPlayerProps {
  // audioRef dibuat di App.tsx agar play() bisa dipanggil saat user gesture (login)
  audioRef: React.RefObject<HTMLAudioElement | null>;
  autoStarted?: boolean;
}

export default function MusicPlayer({ audioRef, autoStarted = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  // Volume 1.0 = sinkron 100% dengan volume perangkat (OS/hardware)
  const [volume, setVolume] = useState(1.0);
  const [progress, setProgress] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [muted, setMuted] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Ref untuk mencegah track-change effect memanggil load() saat pertama mount
  const isFirstMount = useRef(true);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Sinkronkan state isPlaying saat MusicPlayer pertama kali muncul.
  // audio.play() dari App.tsx bersifat async, jadi beri jeda kecil sebelum cek.
  useEffect(() => {
    if (autoStarted && audioRef.current) {
      const audio = audioRef.current;
      // Tunggu sebentar agar promise play() dari App.tsx selesai
      const t = setTimeout(() => {
        if (!audio.paused) {
          setIsPlaying(true);
        } else {
          // Fallback: coba play lagi (bisa terjadi jika audio belum siap)
          audio.play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
      }, 200);
      return () => clearTimeout(t);
    }
  }, [autoStarted]);

  // Volume & mute — update audio element setiap kali berubah
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Close volume slider when clicking outside
  useEffect(() => {
    if (!showVolume) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setShowVolume(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showVolume]);

  // Events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      const next = (currentTrack + 1) % CONFIG.musicPlaylist.length;
      setCurrentTrack(next);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrack]);

  // Track change
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    // Lewati load() pada mount pertama — audio sudah diset dan diplay oleh App.tsx.
    // Memanggil load() di sini akan menghentikan playback yang sudah berjalan.
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    audio.src = CONFIG.musicPlaylist[currentTrack].src;
    audio.volume = muted ? 0 : volume;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => {});
    }
    setProgress(0);
    setCurrentTime(0);
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const skipNext = useCallback(() => {
    setCurrentTrack((t) => (t + 1) % CONFIG.musicPlaylist.length);
  }, []);

  const skipPrev = useCallback(() => {
    setCurrentTrack((t) => (t - 1 + CONFIG.musicPlaylist.length) % CONFIG.musicPlaylist.length);
  }, []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const track = CONFIG.musicPlaylist[currentTrack];

  return (
    <div
      className="fixed bottom-5 left-5 z-50 select-none"
      style={{
        transform: mounted ? "translateY(0)" : "translateY(120px)",
        opacity: mounted ? 1 : 0,
        transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
      }}
    >
      {/* Audio dikelola oleh App.tsx — tidak ada audio tag di sini */}

      {/* ── Minimized pill ── */}
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,182,201,0.4)",
            boxShadow: "0 8px 32px rgba(232,56,79,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          {/* Mini vinyl */}
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #e8384f, #ff85b3)",
              animation: isPlaying ? "spin 3s linear infinite" : "none",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-white opacity-90" />
          </div>

          {/* Waveform bars */}
          <div className="flex items-end gap-0.5 h-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="w-0.5 rounded-full"
                style={{
                  height: isPlaying ? undefined : "4px",
                  background: "linear-gradient(to top, #e8384f, #ff85b3)",
                  animation: isPlaying
                    ? `equalizer ${0.4 + i * 0.1}s ease-in-out ${i * 0.08}s infinite alternate`
                    : "none",
                  minHeight: "4px",
                }}
              />
            ))}
          </div>

          <span
            className="text-xs font-semibold max-w-[80px] truncate"
            style={{ color: "#4a2c3f", fontFamily: "'Quicksand', sans-serif" }}
          >
            {track.title}
          </span>

          <Music2 size={12} style={{ color: "#e8384f" }} />
        </button>
      ) : (
        /* ── Expanded player ── */
        <div
          className="relative overflow-hidden"
          style={{
            width: "280px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,182,201,0.35)",
            boxShadow:
              "0 16px 48px rgba(232,56,79,0.18), 0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          {/* Gradient accent top */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-full"
            style={{ background: "linear-gradient(90deg, #e8384f, #ff85b3, #e8384f)" }}
          />

          <div className="p-4">
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Music2 size={13} style={{ color: "#e8384f" }} />
                <span
                  className="text-xs font-semibold tracking-wide uppercase"
                  style={{ color: "#9b4467", fontFamily: "'Quicksand', sans-serif", letterSpacing: "0.08em" }}
                >
                  Now Playing
                </span>
              </div>
              <button
                onClick={() => setMinimized(true)}
                className="w-6 h-6 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
                style={{ background: "rgba(232,56,79,0.12)" }}
                title="Minimize"
              >
                <ChevronDown size={14} style={{ color: "#e8384f" }} />
              </button>
            </div>

            {/* Vinyl + info */}
            <div className="flex items-center gap-3 mb-4">
              {/* Vinyl disc */}
              <div
                className="relative flex-shrink-0 w-14 h-14 rounded-full shadow-lg"
                style={{
                  background:
                    "conic-gradient(from 0deg, #1a0a0f 0%, #3d1520 20%, #1a0a0f 40%, #3d1520 60%, #1a0a0f 80%, #3d1520 100%)",
                  animation: isPlaying ? "spin 4s linear infinite" : "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                }}
              >
                {/* Pink ring */}
                <div
                  className="absolute inset-2 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #e8384f, #ff85b3)",
                    boxShadow: "0 0 8px rgba(232,56,79,0.5)",
                  }}
                />
                {/* Center hole */}
                <div
                  className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-white"
                  style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", position: "absolute" }}
                />
                <div
                  className="rounded-full bg-[#1a0a0f]"
                  style={{
                    width: "10px",
                    height: "10px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                />
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm truncate"
                  style={{ color: "#2d1020", fontFamily: "'Quicksand', sans-serif" }}
                >
                  {track.title}
                </p>
                <p
                  className="text-xs truncate mt-0.5"
                  style={{ color: "#9b4467", fontFamily: "'Quicksand', sans-serif" }}
                >
                  {track.artist}
                </p>

                {/* Waveform bars */}
                <div className="flex items-end gap-0.5 h-4 mt-1.5">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full"
                      style={{
                        height: isPlaying ? undefined : "3px",
                        background: `linear-gradient(to top, #e8384f, #ff85b3)`,
                        animation: isPlaying
                          ? `equalizer ${0.3 + (i % 4) * 0.12}s ease-in-out ${i * 0.05}s infinite alternate`
                          : "none",
                        minHeight: "3px",
                        opacity: 0.7 + (i % 3) * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-1.5">
              <div
                className="w-full h-1 rounded-full cursor-pointer relative overflow-hidden"
                style={{ background: "rgba(232,56,79,0.15)" }}
                onClick={handleSeek}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #e8384f, #ff85b3)",
                    boxShadow: "0 0 6px rgba(232,56,79,0.5)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px]" style={{ color: "#9b4467", fontFamily: "'Quicksand', sans-serif" }}>
                  {fmt(currentTime)}
                </span>
                <span className="text-[10px]" style={{ color: "#9b4467", fontFamily: "'Quicksand', sans-serif" }}>
                  {fmt(duration)}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              {/* Volume — compact inline */}
              <div className="relative flex items-center gap-1.5" ref={volumeRef}>
                {/* Volume icon button */}
                <button
                  onClick={() => {
                    if (showVolume) {
                      setShowVolume(false);
                    } else {
                      setMuted((m) => !m);
                    }
                  }}
                  onContextMenu={(e) => { e.preventDefault(); setShowVolume((v) => !v); }}
                  className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
                  style={{ background: "rgba(232,56,79,0.1)" }}
                  title="Klik: mute/unmute | Klik kanan: slider"
                >
                  {muted || volume === 0 ? (
                    <VolumeX size={13} style={{ color: "#e8384f" }} />
                  ) : (
                    <Volume2 size={13} style={{ color: "#e8384f" }} />
                  )}
                </button>

                {/* Inline horizontal slider — toggles with a slide animation */}
                <div
                  style={{
                    width: showVolume ? "72px" : "0px",
                    overflow: "hidden",
                    transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.75)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,182,201,0.4)",
                      minWidth: "72px",
                    }}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={muted ? 0 : volume}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setVolume(v);
                        setMuted(v === 0);
                      }}
                      className="cursor-pointer"
                      style={{
                        width: "44px",
                        height: "3px",
                        accentColor: "#e8384f",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="text-[9px] font-semibold tabular-nums"
                      style={{ color: "#9b4467", fontFamily: "'Quicksand', sans-serif", minWidth: "18px" }}
                    >
                      {muted ? "0" : Math.round(volume * 100)}
                    </span>
                  </div>
                </div>

                {/* Toggle slider open/close via volume icon long-click — expose a small chevron */}
                <button
                  onClick={() => setShowVolume((v) => !v)}
                  className="w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full transition-all hover:scale-110"
                  style={{ background: "rgba(232,56,79,0.08)", marginLeft: "-2px" }}
                  title="Tampilkan slider"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path
                      d={showVolume ? "M1 5.5 L4 2.5 L7 5.5" : "M1 2.5 L4 5.5 L7 2.5"}
                      stroke="#e8384f"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Prev */}
              <button
                onClick={skipPrev}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
                style={{ background: "rgba(232,56,79,0.1)" }}
              >
                <SkipBack size={15} style={{ color: "#e8384f" }} />
              </button>

              {/* Play/Pause — main */}
              <button
                onClick={togglePlay}
                className="w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #ff85b3, #e8384f)",
                  boxShadow: "0 4px 16px rgba(232,56,79,0.45)",
                }}
              >
                {isPlaying ? (
                  <Pause size={18} color="white" />
                ) : (
                  <Play size={18} color="white" style={{ marginLeft: "2px" }} />
                )}
              </button>

              {/* Next */}
              <button
                onClick={skipNext}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
                style={{ background: "rgba(232,56,79,0.1)" }}
              >
                <SkipForward size={15} style={{ color: "#e8384f" }} />
              </button>

              {/* Playlist indicator dots */}
              <div className="flex gap-1">
                {CONFIG.musicPlaylist.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentTrack(idx);
                      if (!isPlaying) {
                        setIsPlaying(true);
                        setTimeout(() => audioRef.current?.play().catch(() => {}), 100);
                      }
                    }}
                    className="rounded-full transition-all"
                    style={{
                      width: idx === currentTrack ? "14px" : "5px",
                      height: "5px",
                      background: idx === currentTrack
                        ? "linear-gradient(90deg, #e8384f, #ff85b3)"
                        : "rgba(232,56,79,0.25)",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(232,56,79,0.3), transparent)" }}
          />
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

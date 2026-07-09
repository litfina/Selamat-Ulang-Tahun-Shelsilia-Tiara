import { useState, useCallback, useRef } from "react";
import LoginScene from "./scenes/LoginScene";
import WelcomeScene from "./scenes/WelcomeScene";
import GiftBoxScene from "./scenes/GiftBoxScene";
import LetterScene from "./scenes/LetterScene";
import MusicPlayer from "./components/MusicPlayer";
import { CONFIG } from "./config";

type Scene = "login" | "welcome" | "giftbox" | "letter";

export default function App() {
  const [scene, setScene] = useState<Scene>("login");
  const [transitioning, setTransitioning] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  // Audio element dibuat di App level agar bisa langsung diplay saat user gesture (login)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inisialisasi audio element sekali saja
  if (!audioRef.current) {
    const audio = new Audio();
    audio.src = CONFIG.musicPlaylist[0].src;
    audio.preload = "metadata";
    // Volume = 1.0 agar sinkron 100% dengan volume perangkat (OS controls)
    audio.volume = 1.0;
    audioRef.current = audio;
  }

  const goToScene = useCallback((nextScene: Scene) => {
    setTransitioning(true);
    setTimeout(() => {
      setScene(nextScene);
      setTransitioning(false);
    }, 500);
  }, []);

  const handleLogin = useCallback(() => {
    // Langsung play di sini — masih dalam konteks user gesture (klik tombol submit)
    // sehingga browser mengizinkan autoplay tanpa blocking
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setMusicStarted(true);
    goToScene("welcome");
  }, [goToScene]);

  const handleOpenEnvelope = useCallback(() => {
    goToScene("giftbox");
  }, [goToScene]);

  const handleGiftComplete = useCallback(() => {
    goToScene("letter");
  }, [goToScene]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-[#ffb6c9] via-[#ffd6e3] to-white">
      {/* Transition overlay */}
      <div
        className={`fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-500 ${
          transitioning ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Scenes */}
      {scene === "login" && <LoginScene onLogin={handleLogin} />}
      {scene === "welcome" && <WelcomeScene onOpenEnvelope={handleOpenEnvelope} />}
      {scene === "giftbox" && <GiftBoxScene onComplete={handleGiftComplete} />}
      {scene === "letter" && <LetterScene />}

      {/* Global floating music player — muncul setelah login, tetap di semua scene */}
      {scene !== "login" && (
        <MusicPlayer audioRef={audioRef} autoStarted={musicStarted} />
      )}
    </div>
  );
}


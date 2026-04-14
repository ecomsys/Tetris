import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { playMusic, stopMusic, playSound } from "@/audio/manager";
import { useFullscreen } from "@/hooks/useFullScreen";

import { useSettingsStore } from "@/stores/settings.store";
import { useGameStore } from "@/stores/game.store";
import { BaseUrlResolver } from "@/utils/resolvers";

type Props = {
  gameName?: string;
  className?: string;
  onRestart: () => void;
};

export default function GameHeader({
  gameName,
  className,
  onRestart,
}: Props) {
  /* ===================== */
  /* ===== SETTINGS ====== */
  /* ===================== */

  const {
    soundEnabled,
    musicEnabled,
    toggleSound,
    toggleMusic,
  } = useSettingsStore();

  /* ===================== */
  /* ===== GAME ========= */
  /* ===================== */

  const currentGameId = useGameStore((s) => s.currentGameId);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);

  const game = useGameStore((s) =>
    s.currentGameId ? s.games[s.currentGameId] : null
  );

  const isPaused = game?.status === "paused";

  /* ===================== */
  /* ===== NAVIGATION ==== */
  /* ===================== */

  const { closeFullscreen } = useFullscreen();
  const navigate = useNavigate();

  /* ===================== */
  /* ===== EFFECTS ====== */
  /* ===================== */

  useEffect(() => {
    if (musicEnabled) playMusic();
    else stopMusic();
  }, [musicEnabled]);

  /* ===================== */
  /* ===== HANDLERS ===== */
  /* ===================== */

  const handleHome = () => {
    closeFullscreen();
    navigate("/home");
  };

  const handlePause = () => {
    if (!currentGameId || !game) return;

    if (soundEnabled) {
      const src = BaseUrlResolver('audio/pause.mp3');
      playSound(src);
    }

    if (isPaused) {
      resumeGame(currentGameId);
    } else {
      pauseGame(currentGameId);
    }
  };

  /* ===================== */
  /* ===== UI ============ */
  /* ===================== */

  return (
    <div className="w-full max-w-3xl mx-auto min-w-[20rem]">
      <div className={`relative bg-gradient-to-b from-teal-600 to-teal-900 border-teal-600/40 shadow-[0_0.625rem_1.25rem_rgba(0,0,0,0.25),0_0.25rem_0.375rem_rgba(0,0,0,0.15)]      
      flex items-center flex-row justify-center ${className}
      gap-2 px-1 py-1 mx-auto w-full      
      sm:gap-3 sm:px-3 sm:py-4 rounded-lg sm:rounded-2xl 
      md:px-6 md:justify-evenly md:gap-6`}>

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button onClick={handleHome}>
            <svg className="w-8 h-8 text-white hover:text-yellow-400 transition active:scale-95 cursor-pointer">
              <use
                xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#home`}
              />
            </svg>
          </button>

          <NavLink to="/rules">
            <svg className="w-8 h-8 text-white hover:text-yellow-400 transition active:scale-95 cursor-pointer">
              <use
                xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#info`}
              />
            </svg>
          </NavLink>

          <button onClick={onRestart}>
            <svg className="w-8 h-8 text-white hover:text-yellow-400 transition active:scale-95 cursor-pointer">
              <use
                xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#refresh`}
              />
            </svg>
          </button>
        </div>

        {/* TITLE */}
        {gameName && (
          <div className="flex-1 text-center">
            <h2 className="hidden xs:block text-3xl lg:text-4xl leading-[0.5] text-white font-extrabold">
              {gameName}
            </h2>
          </div>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* PAUSE */}
          <button onClick={handlePause} className="active:scale-95 cursor-pointer">
            <svg
              className={`w-6 h-6 transition ${isPaused ? "text-amber-500" : "text-white"
                }`}
            >
              <use
                xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#pause`}
              />
            </svg>
          </button>

          {/* SOUND */}
          <button onClick={toggleSound} className="active:scale-95 cursor-pointer">
            <svg
              className={`w-8 h-8 transition ${soundEnabled ? "text-white" : "text-amber-500"
                }`}
            >
              <use
                xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#sounds`}
              />
            </svg>
          </button>

          {/* MUSIC */}
          <button onClick={toggleMusic} className="active:scale-95 cursor-pointer">
            <svg
              className={`w-8 h-8 transition ${musicEnabled ? "text-amber-500" : "text-white"
                }`}
            >
              <use
                xlinkHref={`${import.meta.env.BASE_URL}sprite/sprite.svg#music`}
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
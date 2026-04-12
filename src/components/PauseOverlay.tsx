import React from "react";
import { playSound } from "@/audio/manager";
import { BaseUrlResolver } from "@/utils/resolvers";

type PauseOverlayProps = {
  soundEnabled?: boolean;
  onResume: () => void;
  soundPath?: string;
};

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  soundEnabled = false,
  onResume,
  soundPath = BaseUrlResolver('audio/pause.mp3'),
}) => {

  const handleResume = () => {
    if (soundEnabled) {
      playSound(soundPath);
    }
    onResume();
  };

  return (
    <div onClick={handleResume} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="text-white text-2xl font-bold flex flex-col items-center gap-4">
        <div className="text-3xl">⏸ ПАУЗА</div>

        <button
          onClick={handleResume}
          className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 active:scale-95 transition cursor-pointer"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};
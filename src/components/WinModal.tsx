import { ButtonOrange } from "@/ui/button";
import { useEffect } from "react";
import { useGameStore } from "@/stores/game.store";

export default function WinModal({
  isOpen,
  level,
  continueGame,
}: {
  isOpen: boolean;
  level: number;
  continueGame: () => void;
}) {
  const pauseGame = useGameStore((s) => s.pauseGame);
  const currentGameId = useGameStore((s) => s.currentGameId);

  useEffect(() => {
    if (!isOpen || !currentGameId) return;

    pauseGame(currentGameId);
  }, [isOpen, currentGameId, pauseGame]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "Space") {
        e.preventDefault(); // убирает скролл/фокус-дергание
        continueGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, continueGame]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="pointer-events-auto bg-teal-700 text-white rounded-xl shadow-lg px-6 py-4 flex flex-col gap-4 mx-3 sm:mx-5">

        <div className="flex flex-col text-center">
          <span className="font-bold text-2xl">
            Вы переходите на {level}-й уровень!
          </span>

          <span className="text-xs opacity-70 mt-2">
            Enter или Space — продолжить
          </span>
        </div>

        <div className="flex gap-5 justify-center">
          <ButtonOrange onClick={continueGame}>
            <span>Продолжить</span>
          </ButtonOrange>
        </div>

      </div>
    </div>
  );
}
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="pointer-events-auto bg-teal-700 text-white rounded-xl shadow-lg px-6 py-4 flex flex-col gap-4 mx-3 sm:mx-5">

        {/* text */}
        <div className="flex flex-col text-center">
          <span className="font-bold text-2xl">
            Вы переходите на {level}-й уровень!
          </span>
        </div>

        {/* buttons */}
        <div className="flex gap-5 justify-center">
          <ButtonOrange onClick={continueGame}>
            <span>Продолжить</span>
          </ButtonOrange>
        </div>

      </div>
    </div>
  );
}
import { useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { ButtonOrange } from "@/ui/button";
import { playSound } from "@/audio/manager";
import { BaseUrlResolver } from "@/utils/resolvers";

type Props = {
  isOpen: boolean;
  onRestart: () => void;

  score: number;
  level: number;
  lines: number;
  maxSpeed: number;

  isSuccessRun: boolean;
};

export default function LoseModal({
  isOpen,
  onRestart,
  score,
  level,
  lines,
  maxSpeed,
  isSuccessRun,
}: Props) {
  const playedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      playedRef.current = false;
      return;
    }

    if (playedRef.current) return;
    playedRef.current = true;

    const soundSrc = isSuccessRun
      ? BaseUrlResolver("audio/win.mp3")
      : BaseUrlResolver("audio/lose.mp3");

    playSound(soundSrc);
  }, [isOpen, isSuccessRun]);


  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "Space") {
        e.preventDefault(); // убирает скролл/фокус-дергание
        onRestart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onRestart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      {isSuccessRun && (
        <Confetti numberOfPieces={250} recycle={false} />
      )}

      <div className="bg-gradient-to-b from-teal-600 to-teal-900 text-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col gap-5 w-[90%] max-w-md border border-white/10">

        <div className="text-center flex flex-col gap-2">

          <div className="text-5xl">
            {isSuccessRun ? "🎉" : "💀"}
          </div>

          <span className="font-extrabold text-2xl text-center leading-[1]">
            {isSuccessRun
              ? (<span>Неплохо! <br /> Ты дошёл до {level}-го уровня</span>)
              : (<span>Вы проиграли</span>)}
          </span>

          <span className="text-sm text-white/70">
            {isSuccessRun
              ? "Есть потенциал 👀"
              : "Попробуй ещё раз"}
          </span>
        </div>

        {/* stats только если успех */}
        {isSuccessRun && (
          <div className="grid grid-cols-2 gap-3 text-center">
            <Stat label="Очки" value={score} />
            <Stat label="Уровень" value={level} />
            <Stat label="Линий" value={lines} />
            <Stat label="Скорость тика" value={`${maxSpeed} ms`} />
          </div>
        )}

        <div className="flex justify-center mt-2">
          <ButtonOrange onClick={onRestart}>
            Играть снова
          </ButtonOrange>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="bg-white/10 rounded-lg py-2 px-3">
      <div className="text-xs text-white/60">{label}</div>
      <div className="font-bold text-lg">{value}</div>
    </div>
  );
}
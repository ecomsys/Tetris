import { useState } from "react";

import { Board } from "../components/Board";

import LoseModal from "@/components/LoseModal";
import WinModal from "@/components/WinModal";

import GameHeader from "@/components/Header";
import GameStatsPanel from "@/components/StatsPanel";
import { PauseOverlay } from "@/components/PauseOverlay";

import { useSessionStore } from "@/stores/session.store";
import { useSettingsStore } from "@/stores/settings.store";
import { useGameStore } from "@/stores/game.store";

import { useGameLoop } from "@/hooks/useGameLoop";
import { useGameInput } from "@/hooks/useGameInput";

import { useSwipeControls } from "@/hooks/useSwipeControls";

export default function Game() {
    
  const [showLevelUp, setShowLevelUp] = useState(false);

  const session = useSessionStore((s) => s.session);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const resumeGame = useGameStore((s) => s.resumeGame);

  const game = useGameStore((s) =>
    s.currentGameId ? s.games[s.currentGameId] : null
  );

  const isPaused = game?.status === "paused";
  const isFinished = game?.status === "finished" || false;
  const isReady = !!session?.userId && !!game;

  const handleLevelUp = () => {
    setShowLevelUp(true);
  };

  useGameLoop(handleLevelUp);
  useGameInput();
  useSwipeControls();

  if (!game) 
    return (
    <div className="flex items-center justify-center text-center h-full min-h-[100dvh] 
    text-5xl text-red-700 font-bold">Игра не найдена !</div>
  );

  const handleRestart = () => {
    if (!session?.userId || !game) return;
    useGameStore.getState().resetGame(game.id);
  };

  const handleContinue = () => {
    setShowLevelUp(false);
    resumeGame(game.id);
  };

  const handleResume = () => {
    if (!game) return;
    resumeGame(game.id);
  };

  if (!isReady) return null;

  return (
    <div className="flex flex-col h-[100dvh] px-2 py-1 md:py-2 gap-1
    sm:px-4">

      {/* HEADER */}
      <GameHeader
        className="max-w-7xl mx-auto w-full"
        gameName="Тетрис"
        onRestart={handleRestart}
      />

      {/* MAIN */}
      <div className="flex flex-col gap-1 md:gap-3 max-w-6xl mx-auto w-full flex-1 min-h-0
      sm:flex-row sm:justify-center">

        {/* GAME BOARD */}
        <Board
          board={game.data.board}
          piece={game.data.currentPiece}
          orderClasses="order-2 sm:order-1"
        />

        {/* STATE GAME */}
        <GameStatsPanel
          status={game.status}
          speed={game.data.dropInterval}
          score={game.data.score}
          level={game.data.level}
          linesCleared={game.data.linesCleared}
          nextPiece={game.data.nextPiece}
          orderClasses="order-1 sm:order-2"
        />
      </div>

      {/* LOSE MODAL */}
      <LoseModal
        isOpen={isFinished}
        isSuccessRun={game.data.level >= 2}
        score={game.data.score}
        level={game.data.level}
        lines={game.data.linesCleared}
        maxSpeed={game.data.dropInterval}
        onRestart={handleRestart}
      />

      {/* WIN MODAL */}
      <WinModal
        isOpen={showLevelUp || false}
        level={game.data.level}
        continueGame={handleContinue}
      />


      {/* PAUSE OVERLAY */}
      {isPaused && !showLevelUp && (
        <PauseOverlay
          soundEnabled={soundEnabled}
          onResume={handleResume}
        />
      )}
    </div>
  );
}
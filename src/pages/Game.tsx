import { useEffect, useState } from "react";

import { Board } from "../components/Board";

import LoseModal from "@/components/LoseModal";
import WinModal from "@/components/WinModal";

import GameHeader from "@/components/Header";
import GameStatsPanel from "@/components/StatsPanel";
import { PauseOverlay } from "@/components/PauseOverlay";

import { TetrisEngine } from "@/game/tetris/engine";

import { useSessionStore } from "@/stores/session.store";
import { useSettingsStore } from "@/stores/settings.store";
import { useGameStore } from "@/stores/game.store";

import { InputController } from "@/game/tetris/engine/input/input.controller";

export default function Game() {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const session = useSessionStore((s) => s.session);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const game = useGameStore((s) =>
    s.currentGameId ? s.games[s.currentGameId] : null
  );
  const updateGame = useGameStore((s) => s.updateGame);

  /* ===================== */
  /* GAME LOOP */
  /* ===================== */

  useEffect(() => {
    const interval = setInterval(() => {
      const current = useGameStore.getState().getCurrentGame();

      if (!current || current.status !== "running") return;

      const nextState = TetrisEngine.tick(current.data);
      const leveledUp = nextState.level > current.data.level;

      if (leveledUp) {
        setShowLevelUp(true);
      }
      updateGame(current.id, {
        data: nextState,
      });
      if (nextState.isGameOver) {
        useGameStore.getState().setStatus(current.id, "finished");
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);


  const isPaused = game?.status === "paused";
  const isFinished = game?.status === "finished" || false;
  const isReady = !!session?.userId && !!game;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
          InputController.setKey("left", true);
          break;

        case "ArrowRight":
          InputController.setKey("right", true);
          break;

        case "ArrowDown":
          InputController.setKey("down", true);
          break;

        case "ArrowUp":
          InputController.press("rotate");
          break;

        case "Space":
        case " ":
        case "Spacebar":
          InputController.press("hardDrop");
          break;
      }
    };

    const up = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
          InputController.setKey("left", false);
          break;

        case "ArrowRight":
          InputController.setKey("right", false);
          break;

        case "ArrowDown":
          InputController.setKey("down", false);
          break;
      }
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  if (!game) return <div>No game</div>;

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
    <div className="flex flex-col h-[100dvh] px-2 py-2 gap-2
    sm:px-4">

      {/* HEADER */}
      <GameHeader
        className="max-w-7xl mx-auto w-full"
        gameName="Game (unknown)"
        onRestart={handleRestart}
      />

      {/* MAIN */}
      <div className="flex flex-col gap-3 max-w-6xl mx-auto w-full flex-1 min-h-0 
      md:flex-row md:justify-center">

        {/* GAME BOARD */}
        <Board
          board={game.data.board}
          piece={game.data.currentPiece}
        />

        {/* STATE GAME */}
        <GameStatsPanel
          status={game.status}
          players={game.players}

          score={game.data.score}
          level={game.data.level}
          linesCleared={game.data.linesCleared}
          nextPiece={game.data.nextPiece}
        />
      </div>

      {/* LOSE MODAL */}
      <LoseModal
        isOpen={isFinished || false}
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
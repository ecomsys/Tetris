import { useEffect } from "react";
import { useGameStore } from "@/stores/game.store";

export const useVisibilityPause = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      const { currentGameId, games, pauseGame } =
        useGameStore.getState();

      if (!currentGameId) return;

      const game = games[currentGameId];
      if (!game) return;

      // const isPaused = game.status === "paused";
      const isRunning = game.status === "running";

      if (document.hidden && isRunning) {
        pauseGame(currentGameId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);
};
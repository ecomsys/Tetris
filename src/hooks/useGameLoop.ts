import { useEffect } from "react";
import { TetrisEngine } from "@/game/engine";
import { useGameStore } from "@/stores/game.store";
import { useSettingsStore } from "@/stores/settings.store";
import { BaseUrlResolver } from "@/utils/resolvers";
import { playSound } from "@/audio/manager";

const FRAME_TIME = 16;

export function useGameLoop(onLevelUp: () => void) {
  const updateGame = useGameStore((s) => s.updateGame);

  const lockSrc = BaseUrlResolver("/audio/lock.mp3");
  const clearSrc = BaseUrlResolver("/audio/clear.mp3");
  
  useEffect(() => {
    let lastTime = performance.now();
    let accumulator = 0;
    let rafId: number;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);

      const delta = now - lastTime;
      lastTime = now;

      accumulator += delta;

      if (accumulator < FRAME_TIME) return;

      accumulator -= FRAME_TIME;

      const current = useGameStore.getState().getCurrentGame();
      const sound = useSettingsStore.getState().soundEnabled;

      if (!current || current.status !== "running") return;

      const nextState = TetrisEngine.tick(current.data);

      if (nextState.level > current.data.level) {
        onLevelUp();
      }

      if (sound && nextState.events?.pieceLocked) {
        playSound(lockSrc);
      }

      if (sound && nextState.events?.linesCleared) {
        playSound(clearSrc);
      }

      updateGame(current.id, {
        data: { ...nextState, events: undefined },
      });

      if (nextState.isGameOver) {
        useGameStore.getState().setStatus(current.id, "finished");
      }
    };

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [onLevelUp, updateGame]);
}
import type { TetrisState } from "../../types/tetris.types";
import { START_DROP_INTERVAL, LINES_PER_LEVEL } from "../../factory/start.config";

export function updateProgress(state: TetrisState): TetrisState {
  const level = Math.floor(state.linesCleared / LINES_PER_LEVEL) + 1;

  // плавное ускорение (кривая вместо линейки)
  const dropInterval = Math.max(
    30,
    START_DROP_INTERVAL * Math.pow(0.85, level - 1)
  );

  return {
    ...state,
    level,
    dropInterval: Math.floor(dropInterval),
  };
}
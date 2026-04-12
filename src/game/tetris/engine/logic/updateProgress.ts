import type { TetrisState } from "../../types/tetris.types";

const LINES = 5;

export function updateProgress(state: TetrisState): TetrisState {
  const nextLevel = Math.floor(state.linesCleared / LINES) + 1;

  const dropInterval = Math.max(
    100,
    1000 - (nextLevel - 1) * 100
  );

  return {
    ...state,
    level: nextLevel,
    dropInterval   
  };
}
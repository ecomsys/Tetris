import { generatePiece } from "./generatePiece";
import { createEmptyBoard } from "./createEmptyBoard";
import type { TetrisState } from "../types/tetris.types";

import { START_DROP_INTERVAL } from "./start.config";

export function createTetrisState(): TetrisState {

  const firstPiece = generatePiece();

  return {
    board: createEmptyBoard(),

    currentPiece: firstPiece,
    nextPiece: generatePiece(),

    score: 0,
    linesCleared: 0,
    level: 1,

    dropCounter: 0,
    dropInterval: START_DROP_INTERVAL,

    isGameOver: false,
  };
}
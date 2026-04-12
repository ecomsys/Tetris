import { generatePiece } from "./generatePiece";
import { createEmptyBoard } from "./createEmptyBoard";
import type { TetrisState } from "../types/tetris.types";

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
    dropInterval: 800,

    isGameOver: false,
  };
}
import { TETROMINOES } from "./tetrominoes";
import type { Tetromino, TetrominoType } from "../types/tetris.types";

const TYPES: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"];

export function generatePiece(): Tetromino {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];

  return {
    type,
    shape: TETROMINOES[type],
    x: 3,
    y: 0,
  };
}
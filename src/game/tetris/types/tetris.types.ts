import type { GameState } from "@/types/core.types";

export type CellValue = 0 | TetrominoType;
export type TetrisGameState = GameState<TetrisState>;

export interface TetrisState {
  board: CellValue[][]
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  level: number;  
  linesCleared: number;
  dropCounter: number; 
  dropInterval: number;
  isGameOver?: boolean;
}

export type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  x: number;
  y: number;
}

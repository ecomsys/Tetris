import type { TetrisState } from "../../types/tetris.types";
import { clearLines } from "./clearLines";
import { generatePiece } from "../../factory/generatePiece";

import { isColliding } from "./isColiding";
import { updateProgress } from "./updateProgress";


export function lockPiece(state: TetrisState): TetrisState {
  const board = state.board.map(r => [...r]);
  const piece = state.currentPiece;

  if (!piece) return state;

  // фиксируем фигуру
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return;

      const by = piece.y + y;
      const bx = piece.x + x;

      if (board[by]) {
        board[by][bx] = piece.type;
      }
    });
  });

  const cleared = clearLines(board);

  // создаём следующую фигуру
  const nextPiece = generatePiece();

  // GAME OVER CHECK (ВАЖНО)
  if (isColliding(board, nextPiece)) {
    return {
      ...state,
      board,
      currentPiece: null,
      nextPiece,
      isGameOver: true
    };
  }

  // нормальный продолжение игры

  const nextState = updateProgress({
    ...state,
    board,
    currentPiece: state.nextPiece,
    nextPiece,
    linesCleared: state.linesCleared + cleared,
    score: state.score + cleared * 100,

    events: {
      pieceLocked: true,
      linesCleared: cleared,
    },
  });

  return nextState;
}
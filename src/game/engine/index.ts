import { tick } from "./tick";
import { canMove } from "./logic/canMove";
import { lockPiece } from "./logic/lockPiece";
import { hardDrop } from "./logic/hardDrop";
import type { TetrisState } from "../types/tetris.types";
import { KICK_OFFSETS } from "../factory/tetrominoes";

export function softDrop(state: TetrisState): TetrisState {
  const piece = state.currentPiece;
  if (!piece) return state;

  if (!canMove(state.board, piece, 0, 1)) {
    return lockPiece(state);
  }

  return {
    ...state,
    currentPiece: {
      ...piece,
      y: piece.y + 1,
    },
  };
}

export function moveLeft(state: TetrisState): TetrisState {
  const piece = state.currentPiece;
  if (!piece) return state;

  if (!canMove(state.board, piece, -1, 0)) return state;

  return {
    ...state,
    currentPiece: {
      ...piece,
      x: piece.x - 1,
    },
  };
}

export function moveRight(state: TetrisState): TetrisState {
  const piece = state.currentPiece;
  if (!piece) return state;

  if (!canMove(state.board, piece, 1, 0)) return state;

  return {
    ...state,
    currentPiece: {
      ...piece,
      x: piece.x + 1,
    },
  };
}

export function rotate(state: TetrisState): TetrisState {
  const piece = state.currentPiece;
  if (!piece) return state;

  const rotated = piece.shape[0].map((_, i) =>
    piece.shape.map(row => row[i]).reverse()
  );

  const basePiece = {
    ...piece,
    shape: rotated,
  };

  // WALL KICK
  for (const offset of KICK_OFFSETS) {
    const testPiece = {
      ...basePiece,
      x: piece.x + offset.x,
      y: piece.y + offset.y,
    };

    if (canMove(state.board, testPiece, 0, 0)) {
      return {
        ...state,
        currentPiece: testPiece,
      };
    }
  }

  // если вообще нигде не влез — не вращаем
  return state;
}


export const TetrisEngine = {
  tick,
  moveLeft,
  moveRight,
  softDrop,
  rotate,
  hardDrop,
};
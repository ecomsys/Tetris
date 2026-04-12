import type { TetrisState } from "../../types/tetris.types";
import { canMove } from "./canMove";
import { lockPiece } from "./lockPiece";

export function hardDrop(state: TetrisState): TetrisState {
  const piece = state.currentPiece;
  if (!piece) return state;

  const newPiece = { ...piece };

  while (canMove(state.board, newPiece, 0, 1)) {
    newPiece.y += 1;
  }

  return lockPiece({
    ...state,
    currentPiece: newPiece,
  });
}
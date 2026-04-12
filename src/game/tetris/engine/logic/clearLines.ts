import type { CellValue } from "../../types/tetris.types";

export function clearLines(board: CellValue[][]): number {
  let cleared = 0;

  for (let y = board.length - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(board[0].length).fill(0));
      cleared++;
      y++;
    }
  }

  return cleared;
}
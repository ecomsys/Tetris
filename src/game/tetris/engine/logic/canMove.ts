import type { CellValue, Tetromino } from "../../types/tetris.types";

export function canMove(
  board: CellValue[][],
  piece: Tetromino,
  dx: number,
  dy: number
): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (!piece.shape[y][x]) continue;

      const newX = piece.x + x + dx;
      const newY = piece.y + y + dy;

      if (
        newX < 0 ||
        newX >= board[0].length ||
        newY >= board.length
      ) return false;

      if (board[newY]?.[newX]) return false;
    }
  }

  return true;
}
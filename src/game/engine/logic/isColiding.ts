import type { Tetromino, CellValue } from "../../types/tetris.types";

export function isColliding(
  board: CellValue[][],
  piece: Tetromino
): boolean {
  return piece.shape.some((row, y) => {
    return row.some((cell, x) => {
      if (!cell) return false;

      const boardY = piece.y + y;
      const boardX = piece.x + x;

      //  вышли за границы снизу
      if (boardY >= board.length) return true;

      //  вышли за границы слева/справа
      if (boardX < 0 || boardX >= board[0].length) return true;

      // столкновение с уже занятыми клетками
      if (board[boardY]?.[boardX]) return true;

      return false;
    });
  });
}
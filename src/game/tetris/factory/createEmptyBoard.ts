import type { CellValue } from "../types/tetris.types";

export function createEmptyBoard(
  rows = 20,
  cols = 10
): CellValue[][] {
  return Array.from({ length: rows }, () =>
    Array(cols).fill(0 as CellValue)
  );
}
import type { CellValue } from "../types/tetris.types";
import { GLASS_COLS, GLASS_ROWS } from "./start.config";

export function createEmptyBoard(
  rows = GLASS_ROWS,
  cols = GLASS_COLS
): CellValue[][] {
  return Array.from({ length: rows }, () =>
    Array(cols).fill(0 as CellValue)
  );
}
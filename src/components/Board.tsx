import type { Tetromino, CellValue } from "@/game/types/tetris.types";

interface Props {
  board: CellValue[][],
  piece?: Tetromino | null;
  orderClasses?: string;
}

function mergeBoardWithPiece(
  board: CellValue[][],
  piece: Tetromino
) {
  const newBoard = board.map(row => [...row]);

  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return;

      const by = piece.y + y;
      const bx = piece.x + x;

      if (newBoard[by]) {
        newBoard[by][bx] = piece.type;
      }
    });
  });

  return newBoard;
}

const COLORS = {
  I: "bg-cyan-400",
  O: "bg-yellow-400",
  T: "bg-purple-400",
  S: "bg-green-400",
  Z: "bg-red-400",
  J: "bg-blue-400",
  L: "bg-orange-400",
};

export function Board({ board, piece, orderClasses }: Props) {
  const renderBoard = piece
    ? mergeBoardWithPiece(board, piece)
    : board;

  const rows = board.length;
  const cols = board[0].length;

  return (
    <div className={`${orderClasses} flex-1 sm:flex-[initial] min-h-0 sm:min-h-[21rem]  md:min-h-[28rem] xl:min-h-[32.5rem] flex justify-center items-center`}>

      {/* FRAME */}
      <div
        className="h-full border-[0.9375rem] xl:border-[1.25rem] border-teal-900 rounded-b-xl flex"
        style={{
          aspectRatio: `${cols} / ${rows}`,
        }}
      >
        {/* GRID */}
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >


          {renderBoard.map((row, y) =>
            row.map((cell, x) => {
              const isActive =
                piece &&
                piece.shape.some((r, py) =>
                  r.some((c, px) => {
                    if (!c) return false;
                    return piece.y + py === y && piece.x + px === x;
                  })
                );

              let cellClass = "bg-neutral-950";

              if (cell !== 0) {
                const color = COLORS[cell as keyof typeof COLORS];

                cellClass = `${color} ${isActive ? "" : "opacity-80"} shadow-[inset_0_0.125rem_0.375rem_rgba(0,0,0,0.6),inset_0_-0.125rem_0.25rem_rgba(255,255,255,0.2)]`;
              }
              return (
                <div
                  key={`${y}-${x}`}
                  className={`w-full h-full border border-neutral-800 ${cellClass}`}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
import type { GameStatus } from "@/types/core.types";

type Props = {
  status: GameStatus;
  score: number;
  level: number;
  linesCleared: number;
  speed: number;
  nextPiece: {
    type: string;
    shape: number[][];
  } | null;
  orderClasses?: string;
};

const COLORS: Record<string, string> = {
  I: "bg-cyan-400",
  O: "bg-yellow-400",
  T: "bg-purple-400",
  S: "bg-green-400",
  Z: "bg-red-400",
  J: "bg-blue-400",
  L: "bg-orange-400",
};

function normalizePiece(shape: number[][]) {
  let minX = 999, maxX = 0;
  let minY = 999, maxY = 0;

  shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    });
  });

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  const grid = Array.from({ length: height }, () =>
    Array(width).fill(0)
  );

  shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return;

      grid[y - minY][x - minX] = 1;
    });
  });

  return grid;
}

export default function GameStatsPanel({
  status,
  score,
  level,
  speed,
  linesCleared,
  nextPiece,
  orderClasses
}: Props) {
  const shape = nextPiece ? normalizePiece(nextPiece.shape) : null;

  function formatSpeed(ms: number) {
    if (ms <= 30) return "БЕЗУМИЕ";
    if (ms <= 80) return "СЛОЖНО";
    if (ms <= 130) return "БЫСТРО";
    if (ms <= 170) return "СРЕДНЕ";
    return "МЕДЛЕННО";
  }

  function getSpeedColor(ms: number) {
    if (ms <= 20) return "bg-red-500/60";
    if (ms <= 80) return "bg-orange-500/60";
    if (ms <= 130) return "bg-yellow-500/60";
    if (ms <= 200) return "bg-lime-500/40";
    return "bg-green-500/40";
  }

  const speedLabel = formatSpeed(speed);
  const speedColor = getSpeedColor(speed);

  return (
    <div className={`${orderClasses} min-w-[20rem] sm:min-w-[initial] sm:w-[14rem] xl:w-[16rem] `}>
      <div className="
        sm:h-full sm:min-h-[21rem] md:min-h-[28rem] xl:min-h-[32.5rem]
        bg-gradient-to-b from-teal-600 to-teal-900
        border border-white/10
        rounded-xl
        shadow-2xl
        p-2 gap-2
        sm:p-4 sm:gap-6
        flex flex-col 
      ">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-white font-extrabold text-[0.875rem]  md:text-sm xl:text-xl tracking-wide">
            Состояние
          </h2>

          <span className={`
            text-xs px-3 py-1 rounded-md font-bold text-white
            ${status === "running"
              ? "bg-green-500/50"
              : status === "paused"
                ? "bg-yellow-500/50"
                : "bg-red-500/50"}
          `}>
            {status}
          </span>
        </div>

        <div className="flex sm:flex-col gap-2 sm:gap-6 justify-between">
          {/* STATS */}
          <div className="flex sm:flex-col gap-2 md:gap-3">
            <Stat label="Очки" value={score} />
            <Stat label="Уровень" value={level} />
            <Stat label="Линии" value={linesCleared} />
            <Stat
              label="Скорость"
              value={speedLabel}
              accent={speedColor}
            />
          </div>

          {/* NEXT PIECE */}
          <div className="flex flex-col items-center gap-1 md:gap-3">
            <span className="text-white font-extrabold text-[0.75rem] sm:text-sm tracking-widest">
              Очередь
            </span>

            <div className="
            w-full
            flex justify-center
          ">
              <div className="     
              min-h-8         
              sm:w-[7.8125rem] sm:h-[7.8125rem]
              xl:w-[9.375rem] xl:h-[9.375rem]
              sm:bg-black/30
              sm:border border-white/10
              rounded-xl
              flex items-center justify-center
            ">
                {shape && (
                  <div
                    className="grid gap-[0.0625rem]"
                    style={{
                      gridTemplateColumns: `repeat(${shape[0].length}, 1fr)`,
                    }}
                  >
                    {shape.map((row, y) =>
                      row.map((cell, x) => (
                        <div
                          key={`${y}-${x}`}
                          className={`w-3 h-3 md:w-5 md:h-5 xl:w-6 xl:h-6 ${cell ? COLORS[nextPiece!.type] : "bg-transparent"}`}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ===================== */
/* STAT BLOCK */
/* ===================== */
function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <div className={`
      rounded-lg
      px-1 py-1
      md:px-2 md:py-1.5
      xl:px-4 xl:py-3
      flex flex-col md:flex-row justify-between items-center
      bg-white/10
      ${accent ?? ""}
    `}>
      <span className="text-white text-[0.75rem] md:text-sm xl:text-md font-semibold">
        {label}
      </span>
      <span className="text-white font-extrabold text-[0.6875rem] tracking-[-0.07em] md:text-sm xl:text-md">
        {value}
      </span>
    </div>
  );
}
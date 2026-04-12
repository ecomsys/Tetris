import type { Player, GameStatus } from "@/types/core.types";

type Props = {
  status: GameStatus;
  players: Player[];

  score: number;
  level: number;
  linesCleared: number;

  nextPiece: {
    type: string;
    shape: number[][];
  } | null;
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

export default function GameStatsPanel({
  status,
  players,
  score,
  level,
  linesCleared,
  nextPiece,
}: Props) {
  return (
    <div className="w-full flex flex-col min-h-[25rem] md:h-full md:max-w-[22rem]">

      <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 
        border border-teal-600/40 shadow-lg text-white 
        gap-4 px-3 py-4 rounded-lg flex flex-col md:flex-1">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-md font-semibold">
            Game Stats
          </h2>

          <span
            className={`text-xs px-2 py-1 rounded-lg ${
              status === "running"
                ? "bg-green-500/50"
                : status === "paused"
                ? "bg-yellow-500/50"
                : "bg-red-500/50"
            }`}
          >
            {status}
          </span>
        </div>

        {/* SCORE */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 p-2 rounded-lg">
            <div className="text-xs opacity-70">Score</div>
            <div className="font-bold">{score}</div>
          </div>

          <div className="bg-white/10 p-2 rounded-lg">
            <div className="text-xs opacity-70">Level</div>
            <div className="font-bold">{level}</div>
          </div>

          <div className="bg-white/10 p-2 rounded-lg">
            <div className="text-xs opacity-70">Lines</div>
            <div className="font-bold">{linesCleared}</div>
          </div>
        </div>

        {/* NEXT PIECE */}
        <div className="bg-white/10 rounded-xl p-3">
          <div className="text-xs mb-2 opacity-70">
            Next piece
          </div>

          {nextPiece && (
            <div className="grid gap-[2px] w-fit">
              {nextPiece.shape.map((row, y) => (
                <div key={y} className="flex gap-[2px]">
                  {row.map((cell, x) => (
                    <div
                      key={x}
                      className={`w-3 h-3 rounded-sm ${
                        cell
                          ? COLORS[nextPiece.type]
                          : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PLAYERS */}
        <div className="grid grid-cols-2 gap-2 text-sm mt-auto">
          {players.map((player) => (
            <div
              key={player.userId}
              className="p-2 rounded-xl bg-white/10 flex flex-col text-center items-center border border-white/20"
            >
              <span className="text-xs">
                {player.isBot ? "BOT" : "PLAYER"}
              </span>
              <span className="text-[10px] opacity-70">
                {player.userId}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
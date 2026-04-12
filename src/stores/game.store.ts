import { create } from "zustand";
import type { GameState, ID, GameStatus } from "../types/core.types";
import type { TetrisState } from "@/game/tetris/types/tetris.types";

import { createTetrisState } from "@/game/tetris/factory/createTetrisState";

/* ===================== */
/* ===== GAME STORE ==== */
/* ===================== */

interface GameStore<TGameData = TetrisState> {
  games: Record<ID, GameState<TGameData>>;
  currentGameId: ID | null;

  /* ===== CRUD ===== */
  createGame: (game: GameState<TGameData>) => void;
  updateGame: (id: ID, patch: Partial<GameState<TGameData>>) => void;
  removeGame: (id: ID) => void;

  /* ===== CONTEXT ===== */
  setCurrentGame: (id: ID | null) => void;
  getCurrentGame: () => GameState<TGameData> | null;

  /* ===== ENGINE ===== */
  setStatus: (id: ID, status: GameStatus) => void;

  startGame: (id: ID) => void;
  resetGame: (id: ID) => void;

  pauseGame: (id: ID) => void;
  resumeGame: (id: ID) => void;
  finishGame: (id: ID) => void;
}

/* ===================== */
/* ===== STORE ======== */
/* ===================== */

export const useGameStore = create<GameStore<TetrisState>>((set, get) => ({
  games: {},
  currentGameId: null,

  /* ===================== */
  /* ===== CRUD ========= */
  /* ===================== */

  createGame: (game) =>
    set((state) => ({
      games: {
        ...state.games,
        [game.id]: game,
      },
    })),

  resetGame: (id) =>
    set((state) => {
      const game = state.games[id];
      if (!game) return state;

      return {
        games: {
          ...state.games,
          [id]: {
            ...game,

            data: createTetrisState(),

            status: "running",
            startedAt: Date.now(),
            finishedAt: undefined,
          },
        },
      };
    }),

  updateGame: (id, patch) =>
    set((state) => {
      const game = state.games[id];
      if (!game) return state;

      return {
        games: {
          ...state.games,
          [id]: {
            ...game,
            ...patch,
          },
        },
      };
    }),

  removeGame: (id) =>
    set((state) => {
      const games = { ...state.games };
      delete games[id];

      return {
        games,
        currentGameId:
          state.currentGameId === id ? null : state.currentGameId,
      };
    }),

  /* ===================== */
  /* ===== CONTEXT ======= */
  /* ===================== */

  setCurrentGame: (id) => set({ currentGameId: id }),

  getCurrentGame: () => {
    const state = get();

    if (!state.currentGameId) return null;
    return state.games[state.currentGameId] ?? null;
  },

  /* ===================== */
  /* ===== ENGINE ======== */
  /* ===================== */

  setStatus: (id, status) =>
    set((state) => {
      const game = state.games[id];
      if (!game) return state;

      return {
        games: {
          ...state.games,
          [id]: {
            ...game,
            status,
          },
        },
      };
    }),

  startGame: (id) =>
    set((state) => {
      const game = state.games[id];
      if (!game) return state;

      return {
        games: {
          ...state.games,
          [id]: {
            ...game,
            status: "running",
            startedAt: Date.now(),
          },
        },
      };
    }),

  pauseGame: (id) =>
    set((state) => {
      const game = state.games[id];
      if (!game) return state;

      return {
        games: {
          ...state.games,
          [id]: {
            ...game,
            status: "paused",
          },
        },
      };
    }),

  resumeGame: (id) =>
    set((state) => {
      const game = state.games[id];
      if (!game) return state;

      return {
        games: {
          ...state.games,
          [id]: {
            ...game,
            status: "running",
          },
        },
      };
    }),

  finishGame: (id) =>
    set((state) => {
      const game = state.games[id];
      if (!game) return state;

      return {
        games: {
          ...state.games,
          [id]: {
            ...game,
            status: "finished",
            finishedAt: Date.now(),
          },
        },
      };
    }),
}));
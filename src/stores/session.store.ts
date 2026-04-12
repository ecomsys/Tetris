import { create } from "zustand";
import type { UserSession, ID } from "../types/core.types";

/* ===================== */
/* ===== SESSION STORE = */
/* ===================== */

interface SessionStore {
  session: UserSession | null;

  /* ===== BASIC ===== */
  setUser: (userId: ID | null) => void;
  setOnline: (isOnline: boolean) => void;

  /* ===== GAME CONTEXT ===== */
  setCurrentGame: (gameId: ID | null) => void;

  /* ===== SESSION LIFECYCLE ===== */
  startSession: (userId: ID) => void;
  endSession: () => void;

  touch: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,

  /* ===================== */
  /* ===== BASIC ======== */
  /* ===================== */

  setUser: (userId) =>
    set((state) => {
      if (!state.session) return state;

      return {
        session: {
          ...state.session,
          userId: userId ?? "",
        },
      };
    }),

  setOnline: (isOnline) =>
    set((state) => {
      if (!state.session) return state;

      return {
        session: {
          ...state.session,
          isOnline,
          lastActiveAt: Date.now(),
        },
      };
    }),

  /* ===================== */
  /* ===== GAME CONTEXT == */
  /* ===================== */

  setCurrentGame: (gameId) =>
    set((state) => {
      if (!state.session) return state;

      return {
        session: {
          ...state.session,
          currentGameId: gameId,
          lastActiveAt: Date.now(),
        },
      };
    }),

  /* ===================== */
  /* ===== LIFECYCLE ===== */
  /* ===================== */

  startSession: (userId) =>
    set({
      session: {
        userId,
        currentGameId: null,
        isOnline: true,
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
      },
    }),

  endSession: () =>
    set((state) => {
      if (!state.session) return state;

      return {
        session: {
          ...state.session,
          isOnline: false,
          currentGameId: null,
          lastActiveAt: Date.now(),
        },
      };
    }),

  /* ===================== */
  /* ===== HEARTBEAT ===== */
  /* ===================== */

  touch: () =>
    set((state) => {
      if (!state.session) return state;

      return {
        session: {
          ...state.session,
          lastActiveAt: Date.now(),
        },
      };
    }),
}));
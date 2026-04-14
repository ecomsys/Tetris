import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppSettings } from "../types/core.types";

/* ===================== */
/* ===== SETTINGS STORE */
/* ===================== */

interface SettingsStore extends AppSettings {
  toggleSound: () => void;
  toggleMusic: () => void;

  setVolume: (value: number) => void;
  setLanguage: (lang: string) => void;
  setTheme: (theme: AppSettings["theme"]) => void;

  setDebug: (value: boolean) => void;
  reset: () => void;
}

/* ===================== */
/* ===== DEFAULTS ===== */
/* ===================== */

const defaultSettings: AppSettings = {
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.5,
  language: "en",
  theme: "dark",
  debug: false,
  meta: {},
};

/* ===================== */
/* ===== STORE ======== */
/* ===================== */

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      /* ===================== */
      /* ===== TOGGLES ====== */
      /* ===================== */

      toggleSound: () =>
        set((state) => ({
          soundEnabled: !state.soundEnabled,
        })),

      toggleMusic: () =>
        set((state) => ({
          musicEnabled: !state.musicEnabled,
        })),

      /* ===================== */
      /* ===== SETTERS ====== */
      /* ===================== */

      setVolume: (value) =>
        set(() => ({
          volume: Math.max(0, Math.min(1, value)),
        })),

      setLanguage: (lang) =>
        set(() => ({
          language: lang,
        })),

      setTheme: (theme) =>
        set(() => ({
          theme,
        })),

      setDebug: (value) =>
        set(() => ({
          debug: value,
        })),

      /* ===================== */
      /* ===== RESET ======== */
      /* ===================== */

      reset: () => set(() => defaultSettings),
    }),
    {
      name: "game-settings",
      partialize: (state) => ({
        musicEnabled: false,
        soundEnabled: state.soundEnabled,
        volume: state.volume,
        language: state.language,
        theme: state.theme,
        debug: state.debug,
      }),
    }
  )
);
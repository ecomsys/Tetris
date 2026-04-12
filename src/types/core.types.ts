/* ===================== */
/* ===== CORE TYPES ==== */
/* ===================== */

export type ID = string;
export type Timestamp = number;

/* ===================== */
/* ===== USER ========= */
/* ===================== */

/**
 * Глобальный пользователь системы
 * (не привязан к конкретной игре)
 */
export interface User {
  id: ID;
  username?: string;
  photoUrl?: string;
}

/* ===================== */
/* ===== PLAYER ======== */
/* ===================== */

/**
 * Игрок внутри конкретной игры
 * Ссылается на User через userId
 */
export interface Player {
  userId: ID;
  isBot: boolean;
}

/* ===================== */
/* ===== GAME ========= */
/* ===================== */

/**
 * Жизненный цикл игры
 */
export type GameStatus =
  | "waiting"
  | "running"
  | "paused"
  | "finished";

/**
 * Базовое состояние одной игры
 * TGameData — данные конкретной игры (шахматы, тетрис и т.д.)
 */
export interface GameState<TGameData = unknown> {
  id: ID;

  status: GameStatus;

  players: Player[];

  data: TGameData;

  createdAt: Timestamp;

  startedAt?: Timestamp;

  finishedAt?: Timestamp;
}

/* ===================== */
/* ===== SESSION ======= */
/* ===================== */

/**
 * Сессия пользователя в приложении
 * Отвечает за текущий контекст пользователя
 */
export interface UserSession {
  userId: ID;
  currentGameId: ID | null;
  isOnline: boolean;

  createdAt: Timestamp;
  lastActiveAt?: Timestamp;
}

/* ===================== */
/* ===== SETTINGS ====== */
/* ===================== */

/**
 * Глобальные настройки приложения (единый источник правды)
 */
export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;

  volume: number;

  language: string;

  theme: "dark" | "light";

  debug: boolean;

  /**
   * расширение под будущие настройки без ломки типов
   */
  meta?: Record<string, unknown>;
}



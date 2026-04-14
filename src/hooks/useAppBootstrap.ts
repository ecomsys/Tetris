import { useEffect } from "react";

import { useSessionStore } from "@/stores/session.store";
import { useGameStore } from "@/stores/game.store";

import { createTetrisState } from "@/game/factory/createTetrisState";

export const useAppBootstrap = () => {
  useEffect(() => {
    const sessionStore = useSessionStore.getState();
    const gameStore = useGameStore.getState();

    /* ===================== */
    /* ===== SESSION ======= */
    /* ===================== */

    if (!sessionStore.session) {
      sessionStore.startSession("player-1");
    }

    const session = useSessionStore.getState().session;
    if (!session) return;

    /* ===================== */
    /* ===== GAME ========= */
    /* ===================== */

    if (!session.currentGameId) {
      const gameId = crypto.randomUUID();

      gameStore.createGame({
        id: gameId,
        status: "waiting",
        players: [
          {
            userId: session.userId,
            isBot: false,
          },
        ],
        data: createTetrisState(),
        createdAt: Date.now(),
        
      });

      gameStore.setCurrentGame(gameId);
      gameStore.startGame(gameId);

      sessionStore.setCurrentGame(gameId);
    }
  }, []);
};
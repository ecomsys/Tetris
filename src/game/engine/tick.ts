import type { TetrisState } from "../types/tetris.types";
import { InputController } from "./input/input.controller";
import { moveLeft, moveRight, rotate } from ".";
import { hardDrop } from "./logic/hardDrop";
import { softDrop } from ".";
import { INPUT_CONFIG } from "./input/input.config";

/* ===================== */

const FRAME_TIME = 16;
const DAS = INPUT_CONFIG.DAS_DELAY;
const ARR = INPUT_CONFIG.ARR_SPEED;

// фиксированная скорость soft drop (НЕ ЗАВИСИТ ОТ УРОВНЯ)
const SOFT_DROP_INTERVAL = INPUT_CONFIG.SOFT_DROP_INTERNAL;

/* ===================== */

export function tick(state: TetrisState): TetrisState {
  if (state.isGameOver) return state;

  let next = { ...state };

  /* ===================== */
  /* LEFT */
  /* ===================== */

  if (InputController.keys.left) {
    InputController.leftTimer += FRAME_TIME;

    if (InputController.leftTimer === FRAME_TIME) {
      next = moveLeft(next);
    }

    if (InputController.leftTimer > DAS) {
      InputController.leftRepeat += FRAME_TIME;

      if (InputController.leftRepeat >= ARR) {
        next = moveLeft(next);
        InputController.leftRepeat = 0;
      }
    }
  } else {
    InputController.leftTimer = 0;
    InputController.leftRepeat = 0;
  }

  /* ===================== */
  /* RIGHT */
  /* ===================== */

  if (InputController.keys.right) {
    InputController.rightTimer += FRAME_TIME;

    if (InputController.rightTimer === FRAME_TIME) {
      next = moveRight(next);
    }

    if (InputController.rightTimer > DAS) {
      InputController.rightRepeat += FRAME_TIME;

      if (InputController.rightRepeat >= ARR) {
        next = moveRight(next);
        InputController.rightRepeat = 0;
      }
    }
  } else {
    InputController.rightTimer = 0;
    InputController.rightRepeat = 0;
  }

  /* ===================== */
  /* ROTATE / HARD DROP */
  /* ===================== */

  if (InputController.pressed.rotate) {
    next = rotate(next);
    InputController.consume("rotate");
  }

  if (InputController.pressed.hardDrop) {
    next = hardDrop(next);
    InputController.consume("hardDrop");
    return next;
  }

  /* ===================== */
  /* GRAVITY (ТОЛЬКО УРОВЕНЬ) */
  /* ===================== */

  next.dropCounter += FRAME_TIME;

  if (next.dropCounter >= next.dropInterval) {
    next = softDrop(next);
    next.dropCounter = 0;
  }

  /* ===================== */
  /* SOFT DROP (ФИКСИРОВАННЫЙ, НЕ ЗАВИСИТ ОТ УРОВНЯ) */
  /* ===================== */

  if (InputController.keys.down) {
    InputController.downTimer += FRAME_TIME;

    if (InputController.downTimer >= SOFT_DROP_INTERVAL) {
      next = softDrop(next);
      InputController.downTimer = 0;
    }
  } else {
    InputController.downTimer = 0;
  }

  return next;
}
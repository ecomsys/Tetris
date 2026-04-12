import type { TetrisState } from "../types/tetris.types";
import { InputController } from "./input/input.controller";
import { moveLeft, moveRight, rotate } from ".";
import { hardDrop } from "./logic/hardDrop";
import { softDrop } from ".";
import { INPUT_CONFIG } from "./input/input.config";


export function tick(state: TetrisState): TetrisState {
  if (state.isGameOver) return state;

  let next = { ...state };

  // left
  if (InputController.keys.left) {
    InputController.leftTimer += 16;

    // первое движение сразу
    if (InputController.leftTimer === 16) {
      next = moveLeft(next);
    }

    // задержка перед автоповтором
    if (InputController.leftTimer > INPUT_CONFIG.DAS_DELAY) {
      if (InputController.leftTimer % INPUT_CONFIG.ARR_SPEED === 0) {
        next = moveLeft(next);
      }
    }
  } else {
    InputController.leftTimer = 0;
  }

  // RIGHT
  if (InputController.keys.right) {
    InputController.rightTimer += 16;

    if (InputController.rightTimer === 16) {
      next = moveRight(next);
    }

    if (InputController.rightTimer > INPUT_CONFIG.DAS_DELAY) {
      if (InputController.rightTimer % INPUT_CONFIG.ARR_SPEED === 0) {
        next = moveRight(next);
      }
    }
  } else {
    InputController.rightTimer = 0;
  }

  // DOWN
  const isSoftDropping = InputController.keys.down;

  const gravityInterval = state.dropInterval;

  const effectiveInterval = isSoftDropping
    ? gravityInterval / 10
    : gravityInterval;

  // gravity
  next.dropCounter += 16;

  if (next.dropCounter >= effectiveInterval) {
    next = softDrop(next);
    next.dropCounter = 0;
  }

  //  ONE TIME ACTIONS
  if (InputController.pressed.rotate) {
    next = rotate(next);
    InputController.consume("rotate");
  }

  if (InputController.pressed.hardDrop) {
    next = hardDrop(next);
    InputController.consume("hardDrop");
  }

  // gravity
  next.dropCounter += 16;

  if (next.dropCounter >= next.dropInterval) {
    next = softDrop(next);
    next.dropCounter = 0;
  }

  return next;
}
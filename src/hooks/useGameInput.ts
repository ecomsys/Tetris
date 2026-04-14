import { useEffect } from "react";
import { InputController } from "@/game/engine/input/input.controller";

export function useGameInput() {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space") e.preventDefault();

      switch (e.code) {
        case "ArrowLeft":
          InputController.setKey("left", true);
          break;

        case "ArrowRight":
          InputController.setKey("right", true);
          break;

        case "ArrowDown":
          InputController.setKey("down", true);
          break;

        case "ArrowUp":
          InputController.press("rotate");
          break;

        case "Space":
          InputController.press("hardDrop");
          break;
      }
    };

    const up = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
          InputController.setKey("left", false);
          break;

        case "ArrowRight":
          InputController.setKey("right", false);
          break;

        case "ArrowDown":
          InputController.setKey("down", false);
          break;
      }
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
}
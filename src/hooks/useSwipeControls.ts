import { useEffect, useRef } from "react";
import { InputController } from "@/game/engine/input/input.controller";

type Point = { x: number; y: number };

const SWIPE_X = 40;
const SWIPE_Y = 60;
const TAP_MAX_TIME = 250;

// 2 константы ТОЛЬКО для hardDrop
const HARD_DROP_MIN_DISTANCE = 100;
const HARD_DROP_MAX_TIME = 200;

export function useSwipeControls() {
    const lockedAxis = useRef<"x" | "y" | null>(null);
    const activeDirection = useRef<"left" | "right" | null>(null);

    const start = useRef<Point | null>(null);
    const startTime = useRef(0);
    const rotated = useRef(false);

    const STEP_COOLDOWN = 140;
    const lastMoveTime = useRef(0);
    const movedThisGesture = useRef(false);

    useEffect(() => {
        function onTouchStart(e: TouchEvent) {
            lockedAxis.current = null;

            const t = e.touches[0];

            start.current = { x: t.clientX, y: t.clientY };
            startTime.current = Date.now();
            rotated.current = false;

            movedThisGesture.current = false;
        }

        function onTouchMove(e: TouchEvent) {
            if (!start.current) return;

            const t = e.touches[0];

            const dx = t.clientX - start.current.x;
            const dy = t.clientY - start.current.y;

            if (!lockedAxis.current) {
                lockedAxis.current =
                    Math.abs(dx) > Math.abs(dy) ? "x" : "y";
            }

            // ======================
            // X axis
            // ======================
            if (lockedAxis.current === "x") {
                InputController.setKey("down", false);

                const now = Date.now();
                const direction: "left" | "right" = dx > 0 ? "right" : "left";

                const moved = Math.abs(dx);

                // ВАЖНО: смена направления
                if (activeDirection.current && activeDirection.current !== direction) {
                    // сброс старого направления
                    InputController.setKey(activeDirection.current, false);

                    // reset логики удержания
                    movedThisGesture.current = false;
                    lastMoveTime.current = now;

                    activeDirection.current = direction;
                }

                if (!activeDirection.current) {
                    activeDirection.current = direction;
                }

                // 1) первый шаг
                if (!movedThisGesture.current && moved > SWIPE_X) {
                    InputController.setKey(direction, true);
                    movedThisGesture.current = true;
                    lastMoveTime.current = now;
                }

                // 2) удержание
                if (
                    movedThisGesture.current &&
                    now - lastMoveTime.current > STEP_COOLDOWN
                ) {
                    InputController.setKey(direction, true);
                    lastMoveTime.current = now;
                }
            }

            // ======================
            // Y axis
            // ======================
            if (lockedAxis.current === "y") {
                InputController.setKey("left", false);
                InputController.setKey("right", false);

                if (dy > SWIPE_Y) {
                    InputController.setKey("down", true);
                }
            }

            // UP → ROTATE (как у тебя было)
            if (
                dy < -SWIPE_Y &&
                Math.abs(dy) > Math.abs(dx) &&
                !rotated.current
            ) {
                InputController.press("rotate");
                rotated.current = true;
            }
        }

        function onTouchEnd(e: TouchEvent) {
            const duration = Date.now() - startTime.current;

            const t = e.changedTouches[0];
            const end = { x: t.clientX, y: t.clientY };

            const dx = end.x - (start.current?.x ?? end.x);
            const dy = end.y - (start.current?.y ?? end.y);

            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            const isTap =
                duration < TAP_MAX_TIME &&
                absDx < SWIPE_X &&
                absDy < SWIPE_Y;

            // ======================
            // TAP → ROTATE
            // ======================
            if (isTap && !rotated.current) {
                InputController.press("rotate");
            }

            // ======================
            // HARD DROP (ДОБАВИЛИ ВОТ ЭТО)
            // ======================
            const isFastDownSwipe =
                dy > HARD_DROP_MIN_DISTANCE &&
                duration < HARD_DROP_MAX_TIME;

            if (isFastDownSwipe) {
                InputController.press("hardDrop");
            }

            // reset
            InputController.setKey("left", false);
            InputController.setKey("right", false);
            InputController.setKey("down", false);

            start.current = null;
            rotated.current = false;
            lockedAxis.current = null;

            movedThisGesture.current = false;
            lastMoveTime.current = 0;
            activeDirection.current = null;
        }

        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd);

        return () => {
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, []);
}
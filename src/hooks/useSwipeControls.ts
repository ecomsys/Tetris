import { useEffect, useRef } from "react";
import { InputController } from "@/game/engine/input/input.controller";
import { INPUT_CONFIG } from "@/game/engine/input/input.config";

type Point = { x: number; y: number };

const SWIPE_X = 22;
const SWIPE_Y = 28;
const TAP_TIME = 180;

const ARR_DELAY = INPUT_CONFIG.DAS_DELAY; 
const ARR_RATE = 70;

const HARD_DROP_MIN_DISTANCE = 20;

export let forceEndGesture = () => { };

export function useSwipeControls() {
    const start = useRef<Point | null>(null);
    const startTime = useRef(0);

    const singleStepConsumed = useRef(false);

    const gestureActive = useRef(false);

    const axis = useRef<"x" | "y" | null>(null);
    const dir = useRef<"left" | "right" | null>(null);

    const lastMove = useRef(0);
    const repeatStarted = useRef(false);

    const rotated = useRef(false);

    // -------------------------
    // external reset
    // -------------------------
    useEffect(() => {
        forceEndGesture = () => {
            gestureActive.current = false;
            start.current = null;

            axis.current = null;
            dir.current = null;

            lastMove.current = 0;
            repeatStarted.current = false;

            rotated.current = false;
        };
    }, []);

    // -------------------------
    // touch start
    // -------------------------
    useEffect(() => {
        function onTouchStart(e: TouchEvent) {
            gestureActive.current = true;

            const t = e.touches[0];

            start.current = { x: t.clientX, y: t.clientY };
            startTime.current = Date.now();

            axis.current = null;
            dir.current = null;

            lastMove.current = 0;
            repeatStarted.current = false;
            rotated.current = false;
        }

        // -------------------------
        // touch move
        // -------------------------
        function onTouchMove(e: TouchEvent) {
            if (!gestureActive.current || !start.current) return;

            const t = e.touches[0];

            const dx = t.clientX - start.current.x;
            const dy = t.clientY - start.current.y;

            // axis lock
            if (!axis.current) {
                axis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
            }

            // =========================
            // HORIZONTAL MOVE
            // =========================
            if (axis.current === "x") {
                InputController.setKey("down", false);

                const now = Date.now();
                const newDir: "left" | "right" = dx > 0 ? "right" : "left";

                const absDx = Math.abs(dx);

                // смена направления
                if (dir.current && dir.current !== newDir) {
                    InputController.setKey(dir.current, false);

                    repeatStarted.current = false;
                    lastMove.current = now;

                    singleStepConsumed.current = false; // 👈 ВОТ ЭТО ВАЖНО
                }

                dir.current = newDir;

                // =========================
                // 1) SINGLE STEP (1 клетка)
                // =========================
                if (!singleStepConsumed.current && absDx > SWIPE_X) {
                    InputController.setKey(newDir, true);

                    singleStepConsumed.current = true;
                    lastMove.current = now;

                    return; // 👈 КЛЮЧ: не даём уйти в ARR сразу
                }

                // =========================
                // 2) HOLD (DAS + ARR) — твоя логика сохранена
                // =========================
                if (singleStepConsumed.current) {
                    const interval = now - lastMove.current;

                    if (!repeatStarted.current) {
                        if (interval > ARR_DELAY) {
                            repeatStarted.current = true;
                            lastMove.current = now;
                        }
                    } else {
                        if (interval > ARR_RATE) {
                            InputController.setKey(newDir, true);
                            lastMove.current = now;
                        }
                    }
                }
            }
            // =========================
            // VERTICAL MOVE
            // =========================
            if (axis.current === "y") {
                InputController.setKey("left", false);
                InputController.setKey("right", false);

                InputController.setKey("down", dy > SWIPE_Y);
            }

            // rotate swipe up
            if (
                dy < -SWIPE_Y &&
                Math.abs(dy) > Math.abs(dx) &&
                !rotated.current
            ) {
                InputController.press("rotate");
                rotated.current = true;
            }
        }

        // -------------------------
        // touch end
        // -------------------------
        function onTouchEnd(e: TouchEvent) {
            const t = e.changedTouches[0];

            const end = { x: t.clientX, y: t.clientY };

            const dx = end.x - (start.current?.x ?? end.x);
            const dy = end.y - (start.current?.y ?? end.y);

            const duration = Date.now() - startTime.current;

            const isTap =
                duration < TAP_TIME &&
                Math.abs(dx) < SWIPE_X &&
                Math.abs(dy) < SWIPE_Y;

            if (isTap && !rotated.current) {
                InputController.press("rotate");
            }

            const speed = dy / Math.max(duration, 1);

            if (dy > HARD_DROP_MIN_DISTANCE && speed > 0.35) {
                InputController.press("hardDrop");
            }

            // RESET INPUT
            InputController.setKey("left", false);
            InputController.setKey("right", false);
            InputController.setKey("down", false);

            gestureActive.current = false;
            start.current = null;

            axis.current = null;
            dir.current = null;

            repeatStarted.current = false;
            rotated.current = false;
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
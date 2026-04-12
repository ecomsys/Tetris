type KeyState = {
    left: boolean;
    right: boolean;
    down: boolean;
    rotate: boolean;
    hardDrop: boolean;
};

type KeyPressed = {
    rotate: boolean;
    hardDrop: boolean;
};

export const InputController = {
    keys: {
        left: false,
        right: false,
        down: false,
        rotate: false,
        hardDrop: false,
    } as KeyState,
  
    leftTimer: 0,
    rightTimer: 0,

    pressed: {
        rotate: false,
        hardDrop: false,
    } as KeyPressed,

    setKey(key: keyof KeyState, value: boolean) {
        this.keys[key] = value;
    },

    press(key: keyof KeyPressed) {
        this.pressed[key] = true;
    },

    consume(key: keyof KeyPressed) {
        this.pressed[key] = false;
    },

    resetPressed() {
        this.pressed.rotate = false;
        this.pressed.hardDrop = false;
    },
};
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
    downTimer: 0,

    leftRepeat: 0,
    rightRepeat: 0,
    downRepeat: 0,

    softDropTimer: 0,

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

    resetAll() {
        this.keys.left = false;
        this.keys.right = false;
        this.keys.down = false;

        this.leftTimer = 0;
        this.rightTimer = 0;
        this.downTimer = 0;

        this.leftRepeat = 0;
        this.rightRepeat = 0;
        this.downRepeat = 0;

        this.pressed.rotate = false;
        this.pressed.hardDrop = false;
    },

    resetPressed() {
        this.pressed.rotate = false;
        this.pressed.hardDrop = false;
    },
};
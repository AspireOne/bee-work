type Key = {[key: string]: {definition: string[], pressed: boolean}};

// Singleton.
export class Controls {
    // Indicates whether an instance of this object has been created.
    private static instanceCreated = false;
    // The state and definition of globally used keys (does not include game-specific keys etc.).
    public static keys: Readonly<Key> = {
        up: {
            definition: [' ', 'w', 'W'],
            pressed: false,
        },
        right: {
            definition: ['d', 'D'],
            pressed: false,
        },
        left: {
            definition: ['a', 'A'],
            pressed: false,
        },
        floss: {
            definition: ["Shift"],
            pressed: false,
        }
    }
    // Indicates whether keyboard input should be ignored.
    public ignoreUserInput = false;

    // Changes the press state of a key in keys object.
    public static changePressState(definition: string, pressed: boolean): boolean {
        let changed = false;

        Object.values(Controls.keys).forEach(key => {
            if (key.definition.includes(definition)) {
                key.pressed = pressed;
                changed = true;
                // Keep iterating because two keys could have the same definition.
            }
        });

        return changed;
    }

    constructor() {
        if (Controls.instanceCreated)
            throw new Error("Only one instance of Controls is allowed.");

        Controls.instanceCreated = true;
        document.addEventListener("keydown", (e) => this.onKeyChange(e, true));
        document.addEventListener("keyup", (e) => this.onKeyChange(e, false));
    }

    onKeyChange(eOrKey: KeyboardEvent | string, keyDown: boolean) {
        const key = eOrKey instanceof KeyboardEvent ? eOrKey.key : eOrKey;

        if (this.ignoreUserInput && !Controls.keys.floss.definition.includes(key))
            return;

        const changed = Controls.changePressState(key, keyDown);
        if (changed && eOrKey instanceof KeyboardEvent)
            eOrKey.preventDefault();
    }
}
export class Controls {
    public ignoreUserInput = false;

    public static keys: Readonly<any> = {
        up: {
            definition: [' ', 'w', 'W'],
            downPressed: false,
        },
        right: {
            definition: ['d', 'D'],
            downPressed: false,
        },
        left: {
            definition: ['a', 'A'],
            downPressed: false,
        },
        floss: {
            definition: ["Shift"],
            downPressed: false,
        },
        changeDownPressed: function (definition: string, downPressed: boolean): boolean {
            let changed = false;
            Object.values(Controls.keys).forEach((x: any) => {
                if (x?.definition?.includes(definition)) {
                    x.downPressed = downPressed;
                    changed = true;
                    // Keep iterating because two keys could have the same definition.
                }
            })

            return changed;
        }
    }

    constructor() {
        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
    }

    onKeyDown = (e: KeyboardEvent | string) => this.onKeyChange(e, true);
    onKeyUp = (e: KeyboardEvent | string) => this.onKeyChange(e, false);
    onKeyChange(e: KeyboardEvent | string, keyDown: boolean) {
        if (Controls.keys.changeDownPressed(e instanceof KeyboardEvent && !this.ignoreUserInput ? e.key : e, keyDown) && e instanceof KeyboardEvent)
            e.preventDefault();
    }
}
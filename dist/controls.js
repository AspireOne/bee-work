export class Controls {
    constructor() {
        this.ignoreUserInput = false;
        this.onKeyDown = (e) => this.onKeyChange(e, true);
        this.onKeyUp = (e) => this.onKeyChange(e, false);
        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
    }
    onKeyChange(e, keyDown) {
        if (Controls.keys.changeDownPressed(e instanceof KeyboardEvent && !this.ignoreUserInput ? e.key : e, keyDown) && e instanceof KeyboardEvent)
            e.preventDefault();
    }
}
Controls.keys = {
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
    changeDownPressed: function (definition, downPressed) {
        let changed = false;
        Object.values(Controls.keys).forEach((x) => {
            var _a;
            if ((_a = x === null || x === void 0 ? void 0 : x.definition) === null || _a === void 0 ? void 0 : _a.includes(definition)) {
                x.downPressed = downPressed;
                changed = true;
                // Keep iterating because two keys could have the same definition.
            }
        });
        return changed;
    }
};
//# sourceMappingURL=controls.js.map
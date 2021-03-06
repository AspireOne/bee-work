import {Controls} from "../controls.js";
import {Bee} from "../bee.js";
import {Utils} from "../utils/utils.js";

export class ScreenSaverPilot {
    public running = false;
    private controls: Controls;
    private readonly bee: Bee;
    private id = 0;

    constructor(bee: Bee, controls: Controls) {
        this.bee = bee;
        this.controls = controls;
    }

    public start() {
        if (this.running)
            return;

        this.running = true;
        // TODO: Switch for requestanimationframe.
        this.id = window.setInterval(() => this.frame(), 17);
    }

    public stop() {
        if (!this.running)
            return;

        this.running = false;
        clearInterval(this.id);
        Controls.changePressState(Controls.keys.left.definition[0], false);
        Controls.changePressState(Controls.keys.right.definition[0], false);
        Controls.changePressState(Controls.keys.up.definition[0], false);
    }

    private frame() {
        let x = parseInt(this.bee.element.style.left);
        let y = parseInt(this.bee.element.style.top);
        let maxX = document.body.clientWidth - this.bee.element.clientWidth;
        let maxY = document.body.clientHeight - this.bee.element.clientHeight;

        if (x <= 0) {
            Controls.changePressState(Controls.keys.left.definition[0], false);
            Controls.changePressState(Controls.keys.right.definition[0], true);
        } else if (x >= maxX) {
            Controls.changePressState(Controls.keys.right.definition[0], false);
            Controls.changePressState(Controls.keys.left.definition[0], true);
        } else if (this.bee.currAcceleration.x === 0) {
            Controls.changePressState(Controls.keys.left.definition[0], true);
        }

        if (y <= 0)
            Controls.changePressState(Controls.keys.up.definition[0], false);
        else if (y >= maxY)
            Controls.changePressState(Controls.keys.up.definition[0], true);
    }
}
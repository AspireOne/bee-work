import {Controls} from "./controls.js";
import {Bee} from "./bee.js";
import {getAvailableHeight, getAvailableWidth} from "./utils.js";

export class ScreenSaverPilot {
    public readonly player: Bee;
    private static readonly delta = 10;
    private id = 0;
    private controls: Controls;
    public running = false;

    constructor(bee: Bee, controls: Controls) {
        this.player = bee;
        this.controls = controls;
    }

    public start() {
        this.running = true;
        this.id = setInterval(() => this.frame(), ScreenSaverPilot.delta);
    }

    public stop() {
        this.running = false;
        clearInterval(this.id);
        this.controls.onKeyUp(Controls.keys.left.definition[0]);
        this.controls.onKeyUp(Controls.keys.right.definition[0]);
        this.controls.onKeyUp(Controls.keys.up.definition[0]);
    }

    private frame() {
        let elemX = parseInt(this.player.element.style.left.replace("px", ""));
        let elemY = parseInt(this.player.element.style.top.replace("px", ""));
        let maxX = getAvailableWidth() - this.player.element.clientWidth;
        let maxY = getAvailableHeight() - this.player.element.clientHeight;

        if (elemX <= 0) {
            this.controls.onKeyUp(Controls.keys.left.definition[0]);
            this.controls.onKeyDown(Controls.keys.right.definition[0]);
        } else if (elemX >= maxX) {
            this.controls.onKeyUp(Controls.keys.right.definition[0]);
            this.controls.onKeyDown(Controls.keys.left.definition[0]);
        } else if (this.player.accelerationData.currAccelerationX == 0) {
            this.controls.onKeyDown(Controls.keys.left.definition[0]);
        }

        if (elemY <= 0) {
            this.controls.onKeyUp(Controls.keys.up.definition[0]);
        }
        else if (elemY >= maxY) {
            this.controls.onKeyDown(Controls.keys.up.definition[0]);
        }
    }
}
import { Controls } from "./controls.js";
import { getAvailableHeight, getAvailableWidth } from "./utils.js";
export class ScreenSaverPilot {
    constructor(bee, controls) {
        this.id = 0;
        this.running = false;
        this.player = bee;
        this.controls = controls;
    }
    start() {
        this.running = true;
        this.id = setInterval(() => this.frame(), ScreenSaverPilot.delta);
    }
    stop() {
        this.running = false;
        clearInterval(this.id);
        this.controls.onKeyUp(Controls.keys.left.definition[0]);
        this.controls.onKeyUp(Controls.keys.right.definition[0]);
        this.controls.onKeyUp(Controls.keys.up.definition[0]);
    }
    frame() {
        let elemX = parseInt(this.player.bee.style.left.replace("px", ""));
        let elemY = parseInt(this.player.bee.style.top.replace("px", ""));
        let maxX = getAvailableWidth() - this.player.bee.clientWidth;
        let maxY = getAvailableHeight() - this.player.bee.clientHeight;
        if (elemX <= 0) {
            this.controls.onKeyUp(Controls.keys.left.definition[0]);
            this.controls.onKeyDown(Controls.keys.right.definition[0]);
        }
        else if (elemX >= maxX) {
            this.controls.onKeyUp(Controls.keys.right.definition[0]);
            this.controls.onKeyDown(Controls.keys.left.definition[0]);
        }
        else if (this.player.accelerationData.currAccelerationX == 0) {
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
ScreenSaverPilot.delta = 10;
//# sourceMappingURL=screenSaverPilot.js.map
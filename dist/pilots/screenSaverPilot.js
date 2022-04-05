import { Controls } from "../controls.js";
export class ScreenSaverPilot {
    constructor(bee, controls) {
        this.running = false;
        this.id = 0;
        this.bee = bee;
        this.controls = controls;
    }
    start() {
        if (this.running)
            return;
        this.running = true;
        this.id = setInterval(() => this.frame(), this.bee.props.deltaTime.value);
    }
    stop() {
        if (!this.running)
            return;
        this.running = false;
        clearInterval(this.id);
        Controls.changePressState(Controls.keys.left.definition[0], false);
        Controls.changePressState(Controls.keys.right.definition[0], false);
        Controls.changePressState(Controls.keys.up.definition[0], false);
    }
    frame() {
        let x = parseInt(this.bee.element.style.left);
        let y = parseInt(this.bee.element.style.top);
        let maxX = document.body.clientWidth - this.bee.element.clientWidth;
        let maxY = document.body.clientHeight - this.bee.element.clientHeight;
        if (x <= 0) {
            Controls.changePressState(Controls.keys.left.definition[0], false);
            Controls.changePressState(Controls.keys.right.definition[0], true);
        }
        else if (x >= maxX) {
            Controls.changePressState(Controls.keys.right.definition[0], false);
            Controls.changePressState(Controls.keys.left.definition[0], true);
        }
        else if (this.bee.accelerationData.currAccelerationX === 0) {
            Controls.changePressState(Controls.keys.left.definition[0], true);
        }
        if (y <= 0)
            Controls.changePressState(Controls.keys.up.definition[0], false);
        else if (y >= maxY)
            Controls.changePressState(Controls.keys.up.definition[0], true);
    }
}
//# sourceMappingURL=screenSaverPilot.js.map
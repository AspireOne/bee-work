import { Controls } from "./controls.js";
export class Autopilot {
    constructor(bee, controls) {
        this.running = false;
        this.intervalId = 0;
        this.currPressedKey = { x: "", y: "" };
        this.currDelay = { x: 500, y: 500 };
        this.elapsed = { x: 0, y: 0 };
        this.getRandomDelay = () => (Math.random() * (Autopilot.delay.max - Autopilot.delay.min)) + Autopilot.delay.min;
        this.bee = bee;
        this.controls = controls;
    }
    start() {
        if (this.running)
            return;
        this.running = true;
        this.intervalId = setInterval(() => {
            this.updateX();
            this.updateY();
        }, Autopilot.delta);
    }
    stop() {
        if (!this.running)
            return;
        this.running = false;
        clearInterval(this.intervalId);
        this.resetX();
        this.resetY();
    }
    isXOutOfBounds() {
        const beeWidth = this.bee.element.offsetWidth;
        const beeMaxX = document.body.clientWidth - beeWidth;
        return this.bee.currPos.x >= beeMaxX - Autopilot.distanceFromWall || this.bee.currPos.x <= Autopilot.distanceFromWall;
    }
    isYOutOfBounds() {
        const beeHeight = this.bee.element.offsetHeight;
        const beeMaxY = document.body.clientHeight - beeHeight;
        return this.bee.currPos.y >= beeMaxY - Autopilot.distanceFromWall || this.bee.currPos.y <= Autopilot.distanceFromWall;
    }
    // This Y X duplication could be solved by a shared interface or abstract class (as a lot of other things) or what they use here lol, but who has the time for that.
    updateX() {
        /* If the element is out of bounds (too close to a wall), do not respect current
         key delay and force an immediate update, which will make the element fly out of it. */
        if ((this.elapsed.x += Autopilot.delta) >= this.currDelay.x || this.isXOutOfBounds()) {
            this.resetX();
            this.executeNewX();
        }
    }
    resetX() {
        this.elapsed.x = 0;
        if (this.currPressedKey.x != "")
            Controls.changePressState(this.currPressedKey.x, false);
    }
    executeNewX() {
        let key;
        const beeWidth = this.bee.element.offsetWidth;
        const beeMaxX = document.body.clientWidth - beeWidth;
        if (this.bee.currPos.x >= beeMaxX - Autopilot.distanceFromWall)
            key = "a";
        else if (this.bee.currPos.x <= Autopilot.distanceFromWall)
            key = "d";
        else
            key = Autopilot.possibleKeys.x[Math.floor(Math.random() * Autopilot.possibleKeys.x.length)];
        this.currDelay.x = this.getRandomDelay();
        this.currPressedKey.x = key;
        if (key != "")
            Controls.changePressState(key, true);
    }
    updateY() {
        if ((this.elapsed.y += Autopilot.delta) >= this.currDelay.y || this.isYOutOfBounds()) {
            this.resetY();
            this.executeNewY();
        }
    }
    resetY() {
        this.elapsed.y = 0;
        if (this.currPressedKey.y != "")
            Controls.changePressState(this.currPressedKey.y, false);
    }
    executeNewY() {
        let key;
        const beeHeight = this.bee.element.offsetHeight;
        const beeMaxY = document.body.clientHeight - beeHeight;
        if (this.bee.currPos.y >= beeMaxY - Autopilot.distanceFromWall)
            key = "w";
        else if (this.bee.currPos.y <= Autopilot.distanceFromWall)
            key = "";
        else
            key = Autopilot.possibleKeys.y[Math.floor(Math.random() * Autopilot.possibleKeys.y.length)];
        this.currDelay.y = this.getRandomDelay();
        this.currPressedKey.y = key;
        if (key != "")
            Controls.changePressState(key, true);
    }
}
Autopilot.delta = 50;
Autopilot.distanceFromWall = 90;
Autopilot.delay = { max: 550, min: 150 };
Autopilot.possibleKeys = {
    x: ["", "a", "d"],
    y: ["", "w"]
};
//# sourceMappingURL=autopilot.js.map
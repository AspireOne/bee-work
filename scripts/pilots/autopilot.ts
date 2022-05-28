import {Bee} from "../bee.js";
import {Controls} from "../controls.js";
import {Utils} from "../utils/utils.js";
import {Types} from "../utils/types.js";

export class Autopilot {
    private static readonly delta = 50;
    private static readonly distanceFromWall = 90;
    private static readonly delay: Readonly<Types.Range> = { max: 550, min: 150 }
    private static readonly possibleKeys: Readonly<{x: string[], y: string[]}> = {
        x: ["", "a", "d"],
        y: ["", "w"]
    }

    public running = false;
    private intervalId = 0;

    private readonly currPressedKey = { x: "", y: "" }
    private readonly currDelay = { x: 500, y: 500 }
    private readonly elapsed = { x: 0, y: 0 }
    private readonly controls: Controls;
    private readonly bee: Bee;

    constructor(bee: Bee, controls: Controls) {
        this.bee = bee;
        this.controls = controls;
    }

    public start() {
        if (this.running)
            return;
        this.running = true;

        this.intervalId = window.window.setInterval(() => {
            this.updateX();
            this.updateY();
        }, Autopilot.delta);
    }

    public stop() {
        if (!this.running)
            return;
        this.running = false;

        clearInterval(this.intervalId);

        this.resetX();
        this.resetY();
    }

    private isXOutOfBounds(): boolean {
        const beeWidth = this.bee.element.offsetWidth;
        const beeMaxX = document.body.clientWidth - beeWidth;
        return this.bee.currPos.x >= beeMaxX - Autopilot.distanceFromWall || this.bee.currPos.x <= Autopilot.distanceFromWall;
    }

    private isYOutOfBounds(): boolean {
        const beeHeight = this.bee.element.offsetHeight;
        const beeMaxY = document.body.clientHeight - beeHeight;
        return this.bee.currPos.y >= beeMaxY - Autopilot.distanceFromWall || this.bee.currPos.y <= Autopilot.distanceFromWall;
    }

    // This Y X duplication could be solved by a shared interface or abstract class (as a lot of other things) or what they use here lol, but who has the time for that.

    private updateX() {
        /* If the element is out of bounds (too close to a wall), do not respect current
         key delay and force an immediate update, which will make the element fly out of it. */
        if ((this.elapsed.x += Autopilot.delta) >= this.currDelay.x || this.isXOutOfBounds()) {
            this.resetX();
            this.executeNewX();
        }
    }

    private resetX() {
        this.elapsed.x = 0;
        if (this.currPressedKey.x != "")
            Controls.changePressState(this.currPressedKey.x, false);
    }

    private executeNewX() {
        let key: string;

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

    private updateY() {
        if ((this.elapsed.y += Autopilot.delta) >= this.currDelay.y || this.isYOutOfBounds()) {
            this.resetY();
            this.executeNewY();
        }
    }

    private resetY() {
        this.elapsed.y = 0;
        if (this.currPressedKey.y != "")
            Controls.changePressState(this.currPressedKey.y, false);
    }

    private executeNewY() {
        let key: string;

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

    private getRandomDelay = () => (Math.random() * (Autopilot.delay.max - Autopilot.delay.min)) + Autopilot.delay.min;
}
import {Bee} from "./bee.js";
import {Controls} from "./controls.js";
import {getAvailableHeight, getAvailableWidth} from "./utils.js";


export class Autopilot {
    private static readonly delta = 50;
    private static readonly maxDelay = 550;
    private static readonly minDelay = 150;
    private static readonly possibleKeysX = ["", "a", "d"];
    private static readonly possibleKeysY = ["", "w"];
    private currDelayX = 500;
    private currDelayY = 500;
    private elapsedToDelayX = 0;
    private currPressedKeyX: string = "";
    private currPressedKeyY: string = "";
    private elapsedToDelayY = 0;
    private id = 0;
    private playerPosCheckOffset = 90;
    readonly player: Bee;
    public running = false;
    private controls: Controls;

    constructor(bee: Bee, controls: Controls) {
        this.player = bee;
        this.controls = controls;
    }

    public start() {
        if (this.running)
            return;

        this.running = true;
        this.id = setInterval(() => {
            this.updateX();
            this.updateY();
        }, Autopilot.delta);
    }

    public stop() {
        clearInterval(this.id);
        this.id = 0;
        this.running = false;

        this.resetX();
        this.resetY();
    }

    // This Y X duplication could be solved by a shared interface or abstract class (as a lot of other things) or what they use here lol, but who has the time for that.

    private updateX() {
        /* If the bee is out of bounds (too close to a wall), do not respect current
         key delay and force an immediate update, which will make the bee fly out of it. */
        if ((this.elapsedToDelayX += Autopilot.delta) >= this.currDelayX || this.isXOutOfBounds()) {
            this.resetX();
            this.executeNewX();
        }
    }

    private resetX() {
        this.elapsedToDelayX = 0;
        if (this.currPressedKeyX != "")
            this.controls.onKeyUp(this.currPressedKeyX);
    }

    private isXOutOfBounds(): boolean {
        const playerWidth = this.player.bee.offsetWidth;
        const playerMaxX = getAvailableWidth() - playerWidth;
        return this.player.currX >= playerMaxX - this.playerPosCheckOffset || this.player.currX <= this.playerPosCheckOffset;
    }

    private isYOutOfBounds(): boolean {
        const playerHeight = this.player.bee.offsetHeight;
        const playerMaxY = getAvailableHeight() - playerHeight;
        return this.player.currY >= playerMaxY - this.playerPosCheckOffset || this.player.currY <= this.playerPosCheckOffset;
    }

    private executeNewX() {
        let key: string;

        const playerWidth = this.player.bee.offsetWidth;
        const playerMaxX = getAvailableWidth() - playerWidth;

        if (this.player.currX >= playerMaxX - this.playerPosCheckOffset)
            key = "a";
        else if (this.player.currX <= this.playerPosCheckOffset)
            key = "d";
        else
            key = Autopilot.possibleKeysX[Math.floor(Math.random() * Autopilot.possibleKeysX.length)];

        this.currDelayX = this.getRandomDelay();
        this.currPressedKeyX = key;
        if (key != "")
            this.controls.onKeyDown(key);
    }

    private updateY() {
        if ((this.elapsedToDelayY += Autopilot.delta) >= this.currDelayY || this.isYOutOfBounds()) {
            this.resetY();
            this.executeNewY();
        }
    }

    private resetY() {
        this.elapsedToDelayY = 0;
        if (this.currPressedKeyY != "")
            this.controls.onKeyUp(this.currPressedKeyY);
    }

    private executeNewY() {
        let key: string;

        const playerHeight = this.player.bee.offsetHeight;
        const playerMaxY = getAvailableHeight() - playerHeight;

        if (this.player.currY >= playerMaxY - this.playerPosCheckOffset)
            key = "w";
        else if (this.player.currY <= this.playerPosCheckOffset)
            key = "";
        else
            key = Autopilot.possibleKeysY[Math.floor(Math.random() * Autopilot.possibleKeysY.length)];

        this.currDelayY = this.getRandomDelay();
        this.currPressedKeyY = key;
        if (key != "")
            this.controls.onKeyDown((key));
    }

    private getRandomDelay = () => (Math.random() * (Autopilot.maxDelay - Autopilot.minDelay)) + Autopilot.minDelay;
}
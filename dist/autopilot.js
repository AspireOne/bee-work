import { getAvailableHeight, getAvailableWidth } from "./utils.js";
export class Autopilot {
    constructor(bee, controls) {
        this.currDelayX = 500;
        this.currDelayY = 500;
        this.elapsedToDelayX = 0;
        this.currPressedKeyX = "";
        this.currPressedKeyY = "";
        this.elapsedToDelayY = 0;
        this.id = 0;
        this.playerPosCheckOffset = 90;
        this.running = false;
        this.getRandomDelay = () => (Math.random() * (Autopilot.maxDelay - Autopilot.minDelay)) + Autopilot.minDelay;
        this.player = bee;
        this.controls = controls;
    }
    start() {
        if (this.running)
            return;
        this.running = true;
        this.id = setInterval(() => {
            this.updateX();
            this.updateY();
        }, Autopilot.delta);
    }
    stop() {
        clearInterval(this.id);
        this.id = 0;
        this.running = false;
        this.resetX();
        this.resetY();
    }
    // This Y X duplication could be solved by a shared interface or abstract class (as a lot of other things) or what they use here lol, but who has the time for that.
    updateX() {
        /* If the bee is out of bounds (too close to a wall), do not respect current
         key delay and force an immediate update, which will make the bee fly out of it. */
        if ((this.elapsedToDelayX += Autopilot.delta) >= this.currDelayX || this.isXOutOfBounds()) {
            this.resetX();
            this.executeNewX();
        }
    }
    resetX() {
        this.elapsedToDelayX = 0;
        if (this.currPressedKeyX != "")
            this.controls.onKeyUp(this.currPressedKeyX);
    }
    isXOutOfBounds() {
        const playerWidth = this.player.bee.offsetWidth;
        const playerMaxX = getAvailableWidth() - playerWidth;
        return this.player.currX >= playerMaxX - this.playerPosCheckOffset || this.player.currX <= this.playerPosCheckOffset;
    }
    isYOutOfBounds() {
        const playerHeight = this.player.bee.offsetHeight;
        const playerMaxY = getAvailableHeight() - playerHeight;
        return this.player.currY >= playerMaxY - this.playerPosCheckOffset || this.player.currY <= this.playerPosCheckOffset;
    }
    executeNewX() {
        let key;
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
    updateY() {
        if ((this.elapsedToDelayY += Autopilot.delta) >= this.currDelayY || this.isYOutOfBounds()) {
            this.resetY();
            this.executeNewY();
        }
    }
    resetY() {
        this.elapsedToDelayY = 0;
        if (this.currPressedKeyY != "")
            this.controls.onKeyUp(this.currPressedKeyY);
    }
    executeNewY() {
        let key;
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
}
Autopilot.delta = 50;
Autopilot.maxDelay = 550;
Autopilot.minDelay = 150;
Autopilot.possibleKeysX = ["", "a", "d"];
Autopilot.possibleKeysY = ["", "w"];
//# sourceMappingURL=autopilot.js.map
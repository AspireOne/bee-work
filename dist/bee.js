import { VanishingCircle } from "./vanishingCircle.js";
import { getAvailableHeight, getAvailableWidth } from "./utils.js";
import { Controls } from "./controls.js";
import { Acceleration, WayX } from "./pilotUtils.js";
export class Bee {
    constructor(bee, controls) {
        this.currPos = { y: 0, x: 0 };
        this.circle = {
            duration: { default: 400, shift: 2000 },
            frequency: 9,
            size: 80,
            hue: 0,
            timeFromLast: 0
        };
        this.maxSpeed = 7;
        this.deltaTime = 8;
        this.accelerationData = new Acceleration();
        this.renderIntervalId = null;
        this.wayX = WayX.NONE;
        this.scale = 0;
        this.controls = controls;
        this.bee = bee;
        this.scale = parseInt(bee.style.transform.replace(/\D/g, ""));
        this.bee.style.top = getAvailableHeight() - this.bee.offsetHeight + "px";
        this.bee.style.left = getAvailableWidth() / 2 - this.bee.offsetWidth + "px";
        this.bee.style.visibility = "visible";
        this.bee.onclick = () => {
            let text = document.getElementById("bee-text");
            if (text.innerHTML !== "")
                return;
            text.innerHTML = "Bzzzzz";
            text.style.left = bee.style.left;
            text.style.top = parseInt(bee.style.top) - 40 + "px";
            setTimeout(() => text.innerHTML = "", 1500);
        };
    }
    start() {
        VanishingCircle.runLoop();
        if (this.renderIntervalId === null)
            this.renderIntervalId = setInterval(() => this.frame(), this.deltaTime);
    }
    stop() {
        if (this.renderIntervalId !== null) {
            clearInterval(this.renderIntervalId);
            this.renderIntervalId = null;
        }
    }
    frame() {
        let newY = this.calculateNewY();
        let newX = this.calculateNewX();
        this.currPos.y = newY;
        this.currPos.x = newX;
        this.bee.style.top = newY + "px";
        this.bee.style.left = newX + "px";
        this.flipElementIfShould();
        if ((this.circle.timeFromLast += this.deltaTime) >= this.circle.frequency) {
            this.circle.timeFromLast = 0;
            new VanishingCircle(newX, newY, Controls.keys.floss.downPressed ? this.circle.duration.shift : this.circle.duration.default, this.circle.size, 1, this.circle.hue).show();
        }
    }
    flipElementIfShould() {
        let scale = 0;
        if (Controls.keys.right.downPressed)
            scale = -1;
        else if (Controls.keys.left.downPressed)
            scale = 1;
        if (scale !== 0 && scale !== this.scale) {
            this.bee.style.setProperty("transform", "scaleX(" + scale + ")");
            this.scale = scale;
        }
    }
    calculateNewX() {
        const currPosX = parseInt(this.bee.style.left);
        const width = this.bee.offsetWidth;
        const maxX = getAvailableWidth() - width;
        const getUpdatedWay = () => {
            if (this.accelerationData.currAccelerationX > 0)
                return WayX.RIGHT;
            else if (this.accelerationData.currAccelerationX < 0)
                return WayX.LEFT;
            else
                return WayX.NONE;
        };
        const updatedWay = getUpdatedWay();
        let newAcceleration = this.accelerationData.currAccelerationX;
        if (Controls.keys.left.downPressed)
            newAcceleration -= this.accelerationData.acceleration;
        else if (Controls.keys.right.downPressed)
            newAcceleration += this.accelerationData.acceleration;
        else {
            if (updatedWay != this.wayX)
                newAcceleration = 0;
            else if (this.accelerationData.currAccelerationX > 0)
                newAcceleration -= this.accelerationData.acceleration;
            else if (this.accelerationData.currAccelerationX < 0)
                newAcceleration += this.accelerationData.acceleration;
        }
        let newPosX = currPosX + newAcceleration;
        this.accelerationData.currAccelerationX = this.getMaxSpeed(newAcceleration);
        this.wayX = updatedWay;
        if (newPosX < 0) {
            newPosX = 0;
            this.accelerationData.currAccelerationX = 0;
        }
        else if (newPosX > maxX) {
            newPosX = maxX;
            this.accelerationData.currAccelerationX = 0;
        }
        return newPosX;
    }
    calculateNewY() {
        const currPosY = parseInt(this.bee.style.top);
        const height = this.bee.offsetHeight;
        const maxY = getAvailableHeight() - height;
        let newAcceleration = this.accelerationData.currAccelerationY + (Controls.keys.up.downPressed
            ? -this.accelerationData.acceleration
            : this.accelerationData.acceleration);
        let newPosY = currPosY + newAcceleration;
        this.accelerationData.currAccelerationY = this.getMaxSpeed(newAcceleration);
        if (newPosY < 0) {
            newPosY = 0;
            this.accelerationData.currAccelerationY = 0;
        }
        else if (newPosY > maxY) {
            newPosY = maxY;
            this.accelerationData.currAccelerationY = 0;
        }
        return newPosY;
    }
    // Acceleration is there to know if the player is going left or right.
    getMaxSpeed(acceleration) {
        if (acceleration > this.maxSpeed)
            return this.maxSpeed;
        else if (acceleration < -this.maxSpeed)
            return -this.maxSpeed;
        return acceleration;
    }
}
//# sourceMappingURL=bee.js.map
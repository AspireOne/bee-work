import { VanishingCircle } from "./vanishingCircle.js";
import { getAvailableHeight, getAvailableWidth } from "./utils.js";
import { Controls } from "./controls.js";
import { Acceleration, WayX } from "./pilotUtils.js";
export class Bee {
    constructor(element, controls) {
        this.currY = 0;
        this.currX = 0;
        this.maxSpeed = 7;
        this.deltaTime = 8;
        this.accelerationData = new Acceleration();
        this.circleHue = 0;
        this.id = null;
        this.wayX = WayX.NONE;
        this.timeFromLastCircle = 0;
        this.circleFrequency = 9;
        this.scale = 0;
        this.controls = controls;
        this.element = element;
        this.scale = parseInt(element.style.transform.replace(/\D/g, ""));
        this.element.style.top = getAvailableHeight() - this.element.offsetHeight + "px";
        this.element.style.left = "0px";
        this.element.onclick = () => {
            let text = document.getElementById("js-rect-text");
            text.innerHTML = "Bzzzzz";
            text.style.left = element.style.left;
            text.style.top = parseInt(element.style.top) - 40 + "px";
            setTimeout(() => text.innerHTML = "", 1500);
        };
    }
    start() {
        VanishingCircle.runLoop();
        if (this.id === null)
            this.id = setInterval(() => this.frame(), this.deltaTime);
    }
    stop() {
        if (this.id !== null) {
            clearInterval(this.id);
            this.id = null;
        }
    }
    frame() {
        let newY = this.calculateNewY();
        let newX = this.calculateNewX();
        this.currY = newY;
        this.currX = newX;
        this.element.style.top = newY + "px";
        this.element.style.left = newX + "px";
        this.flipElementIfShould();
        if ((this.timeFromLastCircle += this.deltaTime) >= this.circleFrequency) {
            this.timeFromLastCircle = 0;
            new VanishingCircle(newX, newY, Controls.keys.floss.downPressed ? 2000 : 400, 80, 1, this.circleHue).show();
        }
    }
    flipElementIfShould() {
        let scale = 0;
        if (Controls.keys.right.downPressed)
            scale = -1;
        else if (Controls.keys.left.downPressed)
            scale = 1;
        if (scale !== 0 && scale !== this.scale) {
            this.element.style.setProperty("transform", "scaleX(" + scale + ")");
            this.scale = scale;
        }
    }
    calculateNewX() {
        const currPosX = parseInt(this.element.style.left);
        const width = this.element.offsetWidth;
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
        this.accelerationData.currAccelerationX = this.correctAcceleration(newAcceleration);
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
        const currPosY = parseInt(this.element.style.top);
        const height = this.element.offsetHeight;
        const maxY = getAvailableHeight() - height;
        let newAcceleration = this.accelerationData.currAccelerationY + (Controls.keys.up.downPressed ? -this.accelerationData.acceleration : this.accelerationData.acceleration);
        let newPosY = currPosY + newAcceleration;
        this.accelerationData.currAccelerationY = this.correctAcceleration(newAcceleration);
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
    correctAcceleration(acceleration) {
        if (acceleration > this.maxSpeed)
            return this.maxSpeed;
        else if (acceleration < -this.maxSpeed)
            return -this.maxSpeed;
        return acceleration;
    }
}
//# sourceMappingURL=bee.js.map
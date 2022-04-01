import { VanishingCircle } from "./vanishingCircle.js";
import { getAvailableHeight, getAvailableWidth } from "./utils.js";
import { Controls } from "./controls.js";
import { Acceleration, WayX } from "./pilotUtils.js";
export class Bee {
    constructor(bee, controls) {
        this.currPos = { y: 0, x: 0 };
        this.circleProps = {
            durationNormal: {
                value: 400,
                values: {
                    default: 400,
                    min: 50,
                    max: 1000
                }
            },
            durationShift: {
                value: 2000,
                values: {
                    default: 2000,
                    min: 1000,
                    max: 4000
                }
            },
            frequency: {
                value: 9,
                values: {
                    default: 9,
                    min: 7,
                    max: 15
                }
            },
            size: {
                value: 80,
                values: {
                    default: 80,
                    min: 40,
                    max: 200
                }
            },
            hue: {
                value: 0,
                values: {
                    default: 0,
                    min: 0,
                    max: 360
                }
            },
        };
        this.props = {
            maxSpeed: {
                value: 7,
                values: {
                    default: 7,
                    min: 2,
                    max: 25
                }
            },
            deltaTime: {
                value: 8,
                values: {
                    default: 8,
                    min: 1,
                    max: 20
                }
            }
        };
        this.accelerationData = new Acceleration();
        this.timeFromLastCircle = 0;
        this.updateIntervalId = null;
        this.wayX = WayX.NONE;
        this.scale = 0;
        this.controls = controls;
        this.element = bee;
        this.scale = parseInt(bee.style.transform.replace(/\D/g, ""));
        this.element.style.top = getAvailableHeight() - this.element.offsetHeight + "px";
        this.element.style.left = getAvailableWidth() / 2 - this.element.offsetWidth + "px";
        this.element.style.visibility = "visible";
        this.element.onclick = () => {
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
        if (this.updateIntervalId !== null)
            return;
        VanishingCircle.runLoop();
        this.updateIntervalId = setInterval(() => this.frame(), this.props.deltaTime.value);
    }
    stop() {
        if (this.updateIntervalId === null)
            return;
        VanishingCircle.stopLoop();
        clearInterval(this.updateIntervalId);
        this.updateIntervalId = null;
    }
    frame() {
        let newY = this.calculateNewY();
        let newX = this.calculateNewX();
        this.currPos = { y: newY, x: newX };
        this.element.style.top = newY + "px";
        this.element.style.left = newX + "px";
        this.flipElementIfShould();
        if ((this.timeFromLastCircle += this.props.deltaTime.value) >= this.circleProps.frequency.value) {
            this.timeFromLastCircle = 0;
            const props = {
                duration: Controls.keys.floss.downPressed ? this.circleProps.durationShift.value : this.circleProps.durationNormal.value,
                size: this.circleProps.size.value,
                initialOpacity: 1,
                hue: this.circleProps.hue.value
            };
            new VanishingCircle(this.currPos, props).show();
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
        const currPosY = parseInt(this.element.style.top);
        const height = this.element.offsetHeight;
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
        if (acceleration > this.props.maxSpeed.value)
            return this.props.maxSpeed.value;
        else if (acceleration < -this.props.maxSpeed.value)
            return -this.props.maxSpeed.value;
        return acceleration;
    }
}
//# sourceMappingURL=bee.js.map
import { VanishingCircle } from "./vanishingCircle.js";
import { Controls } from "./controls.js";
import { Types } from "./types.js";
var WayX = Types.WayX;
export class Bee {
    constructor(bee, controls) {
        this.currPos = { y: 0, x: 0 };
        this.acceleration = {
            currAccelerationX: 0,
            currAccelerationY: 0,
            acceleration: {
                value: 29,
                values: {
                    default: 29,
                    min: 5,
                    max: 400
                }
            }
        };
        /** Properties of the circle that bee creates. */
        this.circleProps = {
            durationNormal: {
                value: 500,
                values: {
                    default: 500,
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
            size: {
                value: 100,
                values: {
                    default: 100,
                    min: 40,
                    max: 500
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
        /** Properties of the bee. */
        this.props = {
            maxSpeed: {
                value: 12,
                values: {
                    default: 12,
                    min: 3,
                    max: 70
                }
            }
        };
        this.pauseUpdates = false;
        this._running = false;
        this.wayX = WayX.NONE;
        /** Indicates the orientation of the bee (left/right). */
        this.scale = 0;
        this.controls = controls;
        this.element = bee;
        this.scale = parseInt(bee.style.transform.replace(/\D/g, ""));
        this.element.style.top = document.body.clientHeight - this.element.offsetHeight + "px";
        this.element.style.left = document.body.clientWidth / 2 - this.element.offsetWidth + "px";
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
        this.retrieveAndApplySavedProps();
    }
    get running() { return this._running; }
    set running(value) { this._running = value; }
    /** Runs VanishingCircle's update loop and the bee's update loop. */
    start() {
        if (this.running)
            return;
        this.running = true;
        // TODO: Move this to global.ts.
        VanishingCircle.runLoop();
        requestAnimationFrame((timestamp) => {
            this.updatesStartTimestamp = timestamp;
            this.prevUpdateTimestamp = timestamp;
            requestAnimationFrame(this.step.bind(this));
        });
    }
    step(timestamp) {
        const diffBetweenFrames = timestamp - this.prevUpdateTimestamp;
        const delta = diffBetweenFrames / 1000;
        if (!this.pauseUpdates)
            this.frame(delta);
        this.prevUpdateTimestamp = timestamp;
        if (this._running)
            requestAnimationFrame(this.step.bind(this));
    }
    /** Stops VanishingCircle's update loop and the bee's update loop. */
    stop() {
        this.running = false;
        VanishingCircle.stopLoop();
    }
    /** Resets all props to their default values. */
    resetSettings() {
        Object.entries(Object.assign(Object.assign({}, this.props), this.circleProps)).forEach(([key, prop]) => prop.value = prop.values.default);
        this.acceleration.acceleration.value = this.acceleration.acceleration.values.default;
    }
    /** Saves the current props to localStorage. */
    saveProps() {
        const circleProps = this.createObjectWithValuesFromProps(this.circleProps);
        const beeProps = this.createObjectWithValuesFromProps(this.props);
        localStorage.setItem("bee-circleProps", JSON.stringify(circleProps));
        localStorage.setItem("bee-props", JSON.stringify(beeProps));
        localStorage.setItem("bee-acceleration", this.acceleration.acceleration.value + "");
    }
    /** Creates an object with only the current values of the props.
     * @param sourceProps The props to create the object from.
     * @returns An object with the current values of the props.
     */
    createObjectWithValuesFromProps(sourceProps) {
        const values = {};
        Object.entries(sourceProps).forEach(([key, value]) => values[key] = value.value);
        return values;
    }
    /** Applies the saved props to the current props.
     * @param targetProps The props to apply the saved props to.
     * @param savedProps The saved props to apply.
     */
    applySavedProps(targetProps, savedProps) {
        Object.entries(savedProps).forEach(([key, value]) => {
            if (targetProps[key])
                targetProps[key].value = value;
            else
                console.warn("Could not apply saved prop: " + key);
        });
    }
    /** Retrieves all saved props from localStorage and applies them to their respective props. */
    retrieveAndApplySavedProps() {
        let props = localStorage.getItem("bee-props");
        if (props != null) {
            const propsValues = JSON.parse(props);
            this.applySavedProps(this.props, propsValues);
        }
        let circleProps = localStorage.getItem("bee-circleProps");
        if (circleProps != null) {
            const circlePropsValues = JSON.parse(circleProps);
            this.applySavedProps(this.circleProps, circlePropsValues);
        }
        let acceleration = localStorage.getItem("bee-acceleration");
        if (acceleration != null)
            this.acceleration.acceleration.value = parseFloat(acceleration);
    }
    /** Updates the bee's position and orientation and places a next circle (if eligible). */
    frame(delta) {
        let newY = this.calculateNewY(delta);
        let newX = this.calculateNewX(delta);
        this.currPos = { y: newY, x: newX };
        this.element.style.top = newY + "px";
        this.element.style.left = newX + "px";
        this.correctOrientation();
        const props = {
            duration: Controls.keys.floss.pressed ? this.circleProps.durationShift.value : this.circleProps.durationNormal.value,
            size: this.circleProps.size.value,
            initialOpacity: 1,
            hue: this.circleProps.hue.value
        };
        new VanishingCircle({ x: this.currPos.x, y: this.currPos.y }, props).show();
    }
    /** Flips the bee's rotation (left/right) based on the pressed keys. */
    correctOrientation() {
        let scale = 0;
        if (Controls.keys.right.pressed)
            scale = -1;
        else if (Controls.keys.left.pressed)
            scale = 1;
        if (scale !== 0 && scale !== this.scale) {
            this.element.style.setProperty("transform", "scaleX(" + scale + ")");
            this.scale = scale;
        }
    }
    // TODO: Remove this for maxSpeed * scale.
    /** Calculates the next X position of the bee. */
    calculateNewX(delta) {
        const maxX = document.body.clientWidth - this.element.offsetWidth;
        const updatedWay = this.acceleration.currAccelerationX > 0 ? WayX.RIGHT
            : this.acceleration.currAccelerationX < 0 ? WayX.LEFT : WayX.NONE;
        let accIncrease = 0;
        if (Controls.keys.left.pressed)
            accIncrease -= this.acceleration.acceleration.value;
        if (Controls.keys.right.pressed)
            accIncrease += this.acceleration.acceleration.value;
        if (Controls.keys.left.pressed === Controls.keys.right.pressed) {
            if (updatedWay != this.wayX)
                this.acceleration.currAccelerationX = 0;
            else
                accIncrease = this.acceleration.acceleration.value * -Math.sign(this.acceleration.currAccelerationX);
        }
        accIncrease *= delta;
        const totalAcc = this.acceleration.currAccelerationX + accIncrease;
        const totalAccCorrected = this.correctAcceleration(totalAcc);
        this.acceleration.currAccelerationX = totalAccCorrected;
        this.wayX = updatedWay;
        let newPosX = this.currPos.x + totalAccCorrected;
        if (newPosX < 0) {
            newPosX = 0;
            this.acceleration.currAccelerationX = 0;
        }
        else if (newPosX > maxX) {
            newPosX = maxX;
            this.acceleration.currAccelerationX = 0;
        }
        return newPosX;
    }
    /** Calculates the next Y position of the bee. */
    calculateNewY(delta) {
        const maxY = document.body.clientHeight - this.element.offsetHeight;
        let accIncrease = this.acceleration.acceleration.value * (Controls.keys.up.pressed ? -1 : 1);
        accIncrease *= delta;
        const totalAcc = this.acceleration.currAccelerationY + accIncrease;
        const totalAccCorrected = this.correctAcceleration(totalAcc);
        this.acceleration.currAccelerationY = totalAccCorrected;
        let newPosY = this.currPos.y + totalAccCorrected;
        if (newPosY < 0) {
            newPosY = 0;
            this.acceleration.currAccelerationY = 0;
        }
        else if (newPosY > maxY) {
            newPosY = maxY;
            this.acceleration.currAccelerationY = 0;
        }
        return newPosY;
    }
    /**
     * Corrects the acceleration to be within the max speed.
     * @param acceleration To know the orientation the bee is going.
     * @returns The corrected acceleration (if needed).
     */
    correctAcceleration(acceleration) {
        return Math.abs(acceleration) > this.props.maxSpeed.value
            ? this.props.maxSpeed.value * Math.sign(acceleration)
            : acceleration;
    }
}
//# sourceMappingURL=bee.js.map
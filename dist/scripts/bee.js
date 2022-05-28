import { VanishingCircle } from "./vanishingCircle.js";
import { Controls } from "./controls.js";
import { Types } from "./utils/types.js";
var WayX = Types.WayX;
import { PropUtils } from "./utils/propUtils.js";
export class Bee {
    constructor(bee, controls) {
        this.currPos = { y: 0, x: 0 };
        this.currAcceleration = { x: 0, y: 0 };
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
            },
            acceleration: {
                value: 34,
                values: {
                    default: 34,
                    min: 5,
                    max: 400
                }
            }
        };
        this.propsName = "bee-props";
        this.circlePropsName = "bee-circleProps";
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
            window.setTimeout(() => text.innerHTML = "", 1500);
        };
        this.loadAllProps();
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
    resetAllProps() {
        Object.entries(Object.assign(Object.assign({}, this.props), this.circleProps)).forEach(([key, prop]) => prop.value = prop.values.default);
    }
    /** Saves the current props to localStorage. */
    saveAllProps() {
        PropUtils.saveProps(this.props, this.propsName);
        PropUtils.saveProps(this.circleProps, this.circlePropsName);
    }
    loadAllProps() {
        const savedBeeProps = PropUtils.getSavedProps(this.propsName);
        const savedCircleProps = PropUtils.getSavedProps(this.circlePropsName);
        if (savedBeeProps != null)
            PropUtils.applySavedProps(this.props, savedBeeProps);
        if (savedCircleProps != null)
            PropUtils.applySavedProps(this.circleProps, savedCircleProps);
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
        const updatedWay = this.currAcceleration.x > 0 ? WayX.RIGHT
            : this.currAcceleration.x < 0 ? WayX.LEFT : WayX.NONE;
        let accIncrease = 0;
        if (Controls.keys.left.pressed)
            accIncrease -= this.props.acceleration.value;
        if (Controls.keys.right.pressed)
            accIncrease += this.props.acceleration.value;
        if (Controls.keys.left.pressed === Controls.keys.right.pressed) {
            if (updatedWay != this.wayX)
                this.currAcceleration.x = 0;
            else
                accIncrease = this.props.acceleration.value * -Math.sign(this.currAcceleration.x);
        }
        accIncrease *= delta;
        const totalAcc = this.currAcceleration.x + accIncrease;
        const totalAccCorrected = this.correctAcceleration(totalAcc);
        this.currAcceleration.x = totalAccCorrected;
        this.wayX = updatedWay;
        const result = Bee.calculateAxis(maxX, this.currPos.x, totalAccCorrected);
        if (result.resetAcc)
            this.currAcceleration.x = 0;
        return result.newPos;
    }
    /** Calculates the next Y position of the bee. */
    calculateNewY(delta) {
        const maxY = document.body.clientHeight - this.element.offsetHeight;
        let accIncrease = this.props.acceleration.value * (Controls.keys.up.pressed ? -1 : 1);
        accIncrease *= delta;
        const totalAcc = this.currAcceleration.y + accIncrease;
        const totalAccCorrected = this.correctAcceleration(totalAcc);
        this.currAcceleration.y = totalAccCorrected;
        const result = Bee.calculateAxis(maxY, this.currPos.y, totalAccCorrected);
        if (result.resetAcc)
            this.currAcceleration.y = 0;
        return result.newPos;
    }
    static calculateAxis(max, currPos, totalAccCorrected) {
        const result = { newPos: 0, resetAcc: false };
        result.newPos = currPos + totalAccCorrected;
        if (result.newPos < 0) {
            result.newPos = 0;
            result.resetAcc = true;
        }
        else if (result.newPos > max) {
            result.newPos = max;
            result.resetAcc = true;
        }
        return result;
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
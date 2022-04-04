import { VanishingCircle } from "./vanishingCircle.js";
import { Controls } from "./controls.js";
import { Acceleration, WayX } from "./pilotUtils.js";
export class Bee {
    constructor(bee, controls) {
        this.currPos = { y: 0, x: 0 };
        /** Properties of the circle that bee creates. */
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
        /** The time since last circle was created. */
        this.timeFromLastCircle = 0;
        this.updateIntervalId = null;
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
    /** Runs VanishingCircle's update loop and the bee's update loop. */
    start() {
        if (this.updateIntervalId !== null)
            return;
        VanishingCircle.runLoop();
        this.updateIntervalId = setInterval(() => this.frame(), this.props.deltaTime.value);
    }
    /** Stops VanishingCircle's update loop and the bee's update loop. */
    stop() {
        if (this.updateIntervalId === null)
            return;
        VanishingCircle.stopLoop();
        clearInterval(this.updateIntervalId);
        this.updateIntervalId = null;
    }
    /** Resets all props to their default values. */
    resetSettings() {
        Object.entries(Object.assign(Object.assign({}, this.props), this.circleProps)).forEach(([key, prop]) => prop.value = prop.values.default);
        this.accelerationData.acceleration.value = this.accelerationData.acceleration.values.default;
    }
    /** Saves the current props to localStorage. */
    saveProps() {
        const circleProps = this.createObjectWithValuesFromProps(this.circleProps);
        const beeProps = this.createObjectWithValuesFromProps(this.props);
        localStorage.setItem("bee-circleProps", JSON.stringify(circleProps));
        localStorage.setItem("bee-props", JSON.stringify(beeProps));
        localStorage.setItem("bee-acceleration", this.accelerationData.acceleration.value + "");
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
        Object.entries(savedProps).forEach(([key, value]) => targetProps[key].value = value);
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
            this.accelerationData.acceleration.value = parseFloat(acceleration);
    }
    /** Updates the bee's position and orientation and places a next circle (if eligible). */
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
                duration: Controls.keys.floss.pressed ? this.circleProps.durationShift.value : this.circleProps.durationNormal.value,
                size: this.circleProps.size.value,
                initialOpacity: 1,
                hue: this.circleProps.hue.value
            };
            new VanishingCircle(this.currPos, props).show();
        }
    }
    /** Flips the bee's rotation (left/right) based on the pressed keys. */
    flipElementIfShould() {
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
    /** Calculates the next X position of the bee. */
    calculateNewX() {
        const currPosX = parseInt(this.element.style.left);
        const width = this.element.offsetWidth;
        const maxX = document.body.clientWidth - width;
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
        if (Controls.keys.left.pressed)
            newAcceleration -= this.accelerationData.acceleration.value;
        else if (Controls.keys.right.pressed)
            newAcceleration += this.accelerationData.acceleration.value;
        else {
            if (updatedWay != this.wayX)
                newAcceleration = 0;
            else if (this.accelerationData.currAccelerationX > 0)
                newAcceleration -= this.accelerationData.acceleration.value;
            else if (this.accelerationData.currAccelerationX < 0)
                newAcceleration += this.accelerationData.acceleration.value;
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
    /** Calculates the next Y position of the bee. */
    calculateNewY() {
        const currPosY = parseInt(this.element.style.top);
        const height = this.element.offsetHeight;
        const maxY = document.body.clientHeight - height;
        let newAcceleration = this.accelerationData.currAccelerationY + (Controls.keys.up.pressed
            ? -this.accelerationData.acceleration.value
            : this.accelerationData.acceleration.value);
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
    /**
     * @param acceleration To know the orientation the bee is going.
     * @returns The max speed (either positive (down/right) or negative (left/top), based on the acceleration).
     */
    getMaxSpeed(acceleration) {
        if (acceleration > this.props.maxSpeed.value)
            return this.props.maxSpeed.value;
        else if (acceleration < -this.props.maxSpeed.value)
            return -this.props.maxSpeed.value;
        return acceleration;
    }
}
//# sourceMappingURL=bee.js.map
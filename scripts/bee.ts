import {VanishingCircle} from "./vanishingCircle.js";
import {Controls} from "./controls.js";
import {Acceleration, WayX} from "./pilotUtils.js";
import CircleProps = Bee.CircleProps;
import Props = Bee.Props;
import {Utils} from "./utils.js";
import {Types} from "./types.js";
import SaveableProps = Types.SaveableProps;

/** Contains Bee-specific Types. */
export module Bee {
    import ModifiableProp = Types.ModifiableProp;
    export type CircleProps = {
        durationNormal: ModifiableProp,
        durationShift: ModifiableProp,
        frequency: ModifiableProp,
        size: ModifiableProp,
        hue: ModifiableProp
    }

    export type Props = {
        maxSpeed: ModifiableProp,
        deltaTime: ModifiableProp
    }
}

export class Bee {
    public currPos: Types.Point = { y: 0, x: 0 };

    /** Properties of the circle that bee creates. */
    public readonly circleProps: CircleProps = {
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
    public readonly props: Props = {
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

    public accelerationData = new Acceleration();

    /** The base bee element. */
    public element: HTMLElement;

    /** The time since last circle was created. */
    private timeFromLastCircle = 0;
    private updateIntervalId: number | null = null;
    private wayX: WayX = WayX.NONE;
    /** Indicates the orientation of the bee (left/right). */
    private scale = 0;
    private controls: Controls;

    constructor(bee: HTMLElement, controls: Controls) {
        this.controls = controls;
        this.element = bee;
        this.scale = parseInt(bee.style.transform.replace(/\D/g, ""));

        this.element.style.top = document.body.clientHeight - this.element.offsetHeight + "px";
        this.element.style.left = document.body.clientWidth/2 - this.element.offsetWidth + "px";
        this.element.style.visibility = "visible";
        this.element.onclick = () => {
            let text = document.getElementById("bee-text") as HTMLElement;
            if (text.innerHTML !== "")
                return;

            text.innerHTML = "Bzzzzz";
            text.style.left = bee.style.left;
            text.style.top = parseInt(bee.style.top) - 40 + "px";
            setTimeout(() => text.innerHTML = "", 1500);
        }

        this.retrieveAndApplySavedProps();
    }

    /** Runs VanishingCircle's update loop and the bee's update loop. */
    public start() {
        if (this.updateIntervalId !== null)
            return;

        VanishingCircle.runLoop();
        this.updateIntervalId = setInterval(() => this.frame(), this.props.deltaTime.value);
    }

    /** Stops VanishingCircle's update loop and the bee's update loop. */
    public stop() {
        if (this.updateIntervalId === null)
            return;

        VanishingCircle.stopLoop();
        clearInterval(this.updateIntervalId);
        this.updateIntervalId = null;
    }

    /** Resets all props to their default values. */
    public resetSettings() {
        Object.entries({...this.props, ...this.circleProps}).forEach(([key, prop]) => prop.value = prop.values.default);
        this.accelerationData.acceleration.value = this.accelerationData.acceleration.values.default;
    }

    /** Saves the current props to localStorage. */
    public saveProps() {
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
    private createObjectWithValuesFromProps(sourceProps: {[key: string]: Types.ModifiableProp}): Types.SavedModifiableProp {
        const values: Types.SavedModifiableProp = {};
        Object.entries(sourceProps).forEach(([key, value]) => values[key] = value.value);
        return values;
    }

    /** Applies the saved props to the current props.
     * @param targetProps The props to apply the saved props to.
     * @param savedProps The saved props to apply.
     */
    applySavedProps(targetProps: {[key: string]: Types.ModifiableProp}, savedProps: Types.SavedModifiableProp) {
        Object.entries(savedProps).forEach(([key, value]) => targetProps[key].value = value);
    }

    /** Retrieves all saved props from localStorage and applies them to their respective props. */
    public retrieveAndApplySavedProps() {
        let props = localStorage.getItem("bee-props");
        if (props != null) {
            const propsValues = JSON.parse(props) as Types.SavedModifiableProp;
            this.applySavedProps(this.props, propsValues);
        }

        let circleProps = localStorage.getItem("bee-circleProps");
        if (circleProps != null) {
            const circlePropsValues = JSON.parse(circleProps) as Types.SavedModifiableProp;
            this.applySavedProps(this.circleProps, circlePropsValues);
        }

        let acceleration = localStorage.getItem("bee-acceleration");
        if (acceleration != null)
            this.accelerationData.acceleration.value = parseFloat(acceleration);
    }

    /** Updates the bee's position and orientation and places a next circle (if eligible). */
    private frame() {
        let newY = this.calculateNewY();
        let newX = this.calculateNewX();
        this.currPos = {y: newY, x: newX};

        this.element.style.top = newY + "px";
        this.element.style.left = newX + "px";

        this.flipElementIfShould();

        if ((this.timeFromLastCircle += this.props.deltaTime.value) >= this.circleProps.frequency.value) {
            this.timeFromLastCircle = 0;
            const props: VanishingCircle.Props = {
                duration: Controls.keys.floss.pressed ? this.circleProps.durationShift.value : this.circleProps.durationNormal.value,
                size: this.circleProps.size.value,
                initialOpacity: 1,
                hue: this.circleProps.hue.value
            };
            new VanishingCircle(this.currPos, props).show();
        }
    }

    /** Flips the bee's rotation (left/right) based on the pressed keys. */
    private flipElementIfShould() {
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
    private calculateNewX(): number {
        const currPosX = parseInt(this.element.style.left);
        const width = this.element.offsetWidth;
        const maxX = document.body.clientWidth - width;
        const getUpdatedWay = (): WayX => {
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
        } else if (newPosX > maxX) {
            newPosX = maxX;
            this.accelerationData.currAccelerationX = 0;
        }

        return newPosX;
    }

    /** Calculates the next Y position of the bee. */
    private calculateNewY(): number {
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
        } else if (newPosY > maxY) {
            newPosY = maxY;
            this.accelerationData.currAccelerationY = 0;
        }

        return newPosY;
    }

    /**
     * @param acceleration To know the orientation the bee is going.
     * @returns The max speed (either positive (down/right) or negative (left/top), based on the acceleration).
     */
    private getMaxSpeed(acceleration: number): number {
        if (acceleration > this.props.maxSpeed.value)
            return this.props.maxSpeed.value;
        else if (acceleration < -this.props.maxSpeed.value)
            return -this.props.maxSpeed.value;

        return acceleration;
    }
}
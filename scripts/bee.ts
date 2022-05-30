import {VanishingCircle} from "./vanishingCircle.js";
import {Controls} from "./controls.js";
import CircleProps = Bee.CircleProps;
import Props = Bee.Props;
import {Utils} from "./utils/utils.js";
import {Types} from "./utils/types.js";
import WayX = Types.WayX;
import {PropUtils} from "./utils/propUtils.js";
import {onUserLoaded, user} from "./global.js";
import {Database} from "./database/database.js";
import {Models} from "./database/models";

/** Contains Bee-specific Types. */
export module Bee {
    import ModifiableProp = Types.ModifiableProp;
    export type CircleProps = {
        durationNormal: ModifiableProp,
        durationShift: ModifiableProp,
        size: ModifiableProp,
        hue: ModifiableProp
    }

    export type Props = {
        maxSpeed: ModifiableProp,
        acceleration: ModifiableProp
    }
}

export class Bee {
    public currPos: Types.Point = { y: 0, x: 0 };

    public readonly currAcceleration = { x: 0, y: 0 }
    /** Properties of the circle that bee creates. */
    public readonly circleProps: CircleProps = {
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
    public readonly props: Props = {
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

    public readonly propsName: string = "bee-props";
    public readonly circlePropsName: string = "bee-circleProps";
    public pauseUpdates: boolean = false;
    private _running: boolean = false;

    public get running(): boolean {return this._running;}
    public set running(value: boolean) {this._running = value;}
    /** The base bee element. */
    public element: HTMLElement;
    private updatesStartTimestamp: number | undefined;
    private prevUpdateTimestamp: number | undefined;
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
            window.setTimeout(() => text.innerHTML = "", 1500);
        }

        this.loadAllProps(false);
        onUserLoaded((user) => this.loadAllProps(true));
    }

    /** Runs VanishingCircle's update loop and the bee's update loop. */
    public start() {
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

    private step(timestamp: number) {
        const diffBetweenFrames = timestamp - (this.prevUpdateTimestamp as number);
        const delta = diffBetweenFrames / 1000;

        if (!this.pauseUpdates)
            this.frame(delta);

        this.prevUpdateTimestamp = timestamp;
        if (this._running)
            requestAnimationFrame(this.step.bind(this));
    }

    /** Stops VanishingCircle's update loop and the bee's update loop. */
    public stop() {
        this.running = false;
        VanishingCircle.stopLoop();
    }

    /** Resets all props to their default values. */
    public resetAllProps() {
        Object.entries({...this.props, ...this.circleProps}).forEach(([key, prop]) => prop.value = prop.values.default);
    }

    /** Saves the current props to localStorage. */
    public saveAllProps() {
        if (user == null)
            return;

        PropUtils.saveProps(this.props, this.propsName);
        PropUtils.saveProps(this.circleProps, this.circlePropsName);
        user.bee_props = PropUtils.convertPropsToSaveProps(this.props);
        user.circle_props = PropUtils.convertPropsToSaveProps(this.circleProps);

        Database.request<Models.User.Interface>("update-user", user)
            .then(user => console.log(JSON.stringify(user)))
            .catch(error => console.log(JSON.stringify(error)))
    }

    public loadAllProps(fromDb: boolean) {
        if (fromDb && user == null)
            return;

        const savedBeeProps = fromDb ? user?.bee_props : PropUtils.getSavedProps(this.propsName);
        const savedCircleProps = fromDb ? user?.circle_props : PropUtils.getSavedProps(this.circlePropsName);

        if (savedBeeProps != null)
            PropUtils.applySavedProps(this.props, savedBeeProps);
        if (savedCircleProps != null)
            PropUtils.applySavedProps(this.circleProps, savedCircleProps);
    }

    /** Updates the bee's position and orientation and places a next circle (if eligible). */
    private frame(delta: number) {
        let newY = this.calculateNewY(delta);
        let newX = this.calculateNewX(delta);
        this.currPos = {y: newY, x: newX};

        this.element.style.top = newY + "px";
        this.element.style.left = newX + "px";
        this.correctOrientation();

        const props: VanishingCircle.Props = {
            duration: Controls.keys.floss.pressed ? this.circleProps.durationShift.value : this.circleProps.durationNormal.value,
            size: this.circleProps.size.value,
            initialOpacity: 1,
            hue: this.circleProps.hue.value
        };
        new VanishingCircle({x: this.currPos.x, y: this.currPos.y}, props).show();
    }

    /** Flips the bee's rotation (left/right) based on the pressed keys. */
    private correctOrientation() {
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
    private calculateNewX(delta: number): number {
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
    private calculateNewY(delta: number): number {
        const maxY = document.body.clientHeight - this.element.offsetHeight;

        let accIncrease = this.props.acceleration.value * (Controls.keys.up.pressed ?  -1 : 1);
        accIncrease *= delta;
        const totalAcc = this.currAcceleration.y + accIncrease;
        const totalAccCorrected = this.correctAcceleration(totalAcc);
        this.currAcceleration.y = totalAccCorrected;

        const result = Bee.calculateAxis(maxY, this.currPos.y, totalAccCorrected);
        if (result.resetAcc)
            this.currAcceleration.y = 0;
        return result.newPos;
    }
    private static calculateAxis(max: number, currPos: number, totalAccCorrected: number): {newPos: number, resetAcc: boolean} {
        const result = {newPos: 0, resetAcc: false};
        result.newPos = currPos + totalAccCorrected;

        if (result.newPos < 0) {
            result.newPos = 0;
            result.resetAcc = true;
        } else if (result.newPos > max) {
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
    private correctAcceleration(acceleration: number): number {
        return Math.abs(acceleration) > this.props.maxSpeed.value
            ? this.props.maxSpeed.value * Math.sign(acceleration)
            : acceleration;
    }
}
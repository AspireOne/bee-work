import { Controls } from "./controls.js";
import CircleProps = Bee.CircleProps;
import Props = Bee.Props;
import { Types } from "./types.js";
/** Contains Bee-specific Types. */
export declare module Bee {
    import ModifiableProp = Types.ModifiableProp;
    type CircleProps = {
        durationNormal: ModifiableProp;
        durationShift: ModifiableProp;
        size: ModifiableProp;
        hue: ModifiableProp;
    };
    type Props = {
        maxSpeed: ModifiableProp;
        acceleration: ModifiableProp;
    };
}
export declare class Bee {
    currPos: Types.Point;
    readonly acceleration: {
        currAccelerationX: number;
        currAccelerationY: number;
    };
    /** Properties of the circle that bee creates. */
    readonly circleProps: CircleProps;
    /** Properties of the bee. */
    readonly props: Props;
    pauseUpdates: boolean;
    private _running;
    get running(): boolean;
    set running(value: boolean);
    /** The base bee element. */
    element: HTMLElement;
    private updatesStartTimestamp;
    private prevUpdateTimestamp;
    private wayX;
    /** Indicates the orientation of the bee (left/right). */
    private scale;
    private controls;
    constructor(bee: HTMLElement, controls: Controls);
    /** Runs VanishingCircle's update loop and the bee's update loop. */
    start(): void;
    private step;
    /** Stops VanishingCircle's update loop and the bee's update loop. */
    stop(): void;
    /** Resets all props to their default values. */
    resetSettings(): void;
    /** Saves the current props to localStorage. */
    saveProps(): void;
    /** Creates an object with only the current values of the props.
     * @param sourceProps The props to create the object from.
     * @returns An object with the current values of the props.
     */
    private createObjectWithValuesFromProps;
    /** Applies the saved props to the current props.
     * @param targetProps The props to apply the saved props to.
     * @param savedProps The saved props to apply.
     */
    applySavedProps(targetProps: {
        [key: string]: Types.ModifiableProp;
    }, savedProps: Types.SavedModifiableProp): void;
    /** Retrieves all saved props from localStorage and applies them to their respective props. */
    retrieveAndApplySavedProps(): void;
    /** Updates the bee's position and orientation and places a next circle (if eligible). */
    private frame;
    /** Flips the bee's rotation (left/right) based on the pressed keys. */
    private correctOrientation;
    /** Calculates the next X position of the bee. */
    private calculateNewX;
    /** Calculates the next Y position of the bee. */
    private calculateNewY;
    private static calculateAxis;
    /**
     * Corrects the acceleration to be within the max speed.
     * @param acceleration To know the orientation the bee is going.
     * @returns The corrected acceleration (if needed).
     */
    private correctAcceleration;
}

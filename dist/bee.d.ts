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
        frequency: ModifiableProp;
        size: ModifiableProp;
        hue: ModifiableProp;
    };
    type Props = {
        maxSpeed: ModifiableProp;
        deltaTime: ModifiableProp;
    };
}
declare class Acceleration {
    currAccelerationX: number;
    currAccelerationY: number;
    readonly acceleration: Types.ModifiableProp;
    constructor(acceleration?: number);
}
export declare class Bee {
    currPos: Types.Point;
    /** Properties of the circle that bee creates. */
    readonly circleProps: CircleProps;
    /** Properties of the bee. */
    readonly props: Props;
    accelerationData: Acceleration;
    pauseUpdates: boolean;
    /** The base bee element. */
    element: HTMLElement;
    /** The time since last circle was created. */
    private timeFromLastCircle;
    private updateIntervalId;
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
    /**
     * @param acceleration To know the orientation the bee is going.
     * @returns The max speed (either positive (down/right) or negative (left/top), based on the acceleration).
     */
    private getMaxSpeed;
}
export {};

import { Controls } from "./controls.js";
import { Acceleration } from "./pilotUtils.js";
import CircleProps = Bee.CircleProps;
import Props = Bee.Props;
import { Utils } from "./utils.js";
export declare module Bee {
    import ModifiableProp = Utils.ModifiableProp;
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
export declare class Bee {
    currPos: Utils.Point;
    circleProps: CircleProps;
    props: Props;
    accelerationData: Acceleration;
    element: HTMLElement;
    private timeFromLastCircle;
    private updateIntervalId;
    private wayX;
    private scale;
    private controls;
    constructor(bee: HTMLElement, controls: Controls);
    start(): void;
    stop(): void;
    resetSettings(): void;
    saveCurrentSettings(): void;
    createObjectWithValuesFromProps(sourceProps: {
        [key: string]: Utils.ModifiableProp;
    }): Utils.SavedModifiableProp;
    updatePropsValues(targetProps: {
        [key: string]: Utils.ModifiableProp;
    }, values: Utils.SavedModifiableProp): void;
    private applySavedSettings;
    private frame;
    private flipElementIfShould;
    private calculateNewX;
    private calculateNewY;
    private getMaxSpeed;
}

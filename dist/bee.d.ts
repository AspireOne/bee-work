import { Controls } from "./controls.js";
import { Acceleration } from "./pilotUtils.js";
export interface modifiableProp {
    value: number;
    values: {
        readonly default: number;
        readonly min: number;
        readonly max: number;
    };
}
export declare class Bee {
    currPos: {
        y: number;
        x: number;
    };
    circleProps: {
        durationNormal: {
            value: number;
            values: {
                default: number;
                min: number;
                max: number;
            };
        };
        durationShift: {
            value: number;
            values: {
                default: number;
                min: number;
                max: number;
            };
        };
        frequency: {
            value: number;
            values: {
                default: number;
                min: number;
                max: number;
            };
        };
        size: {
            value: number;
            values: {
                default: number;
                min: number;
                max: number;
            };
        };
        hue: {
            value: number;
            values: {
                default: number;
                min: number;
                max: number;
            };
        };
    };
    props: {
        maxSpeed: {
            value: number;
            values: {
                default: number;
                min: number;
                max: number;
            };
        };
        deltaTime: {
            value: number;
            values: {
                default: number;
                min: number;
                max: number;
            };
        };
    };
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
    private frame;
    private flipElementIfShould;
    private calculateNewX;
    private calculateNewY;
    private getMaxSpeed;
}

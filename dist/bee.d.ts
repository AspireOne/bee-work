import { Controls } from "./controls.js";
import { Acceleration } from "./pilotUtils.js";
export declare class Bee {
    currPos: {
        y: number;
        x: number;
    };
    circle: {
        duration: {
            default: number;
            shift: number;
        };
        frequency: number;
        size: number;
        hue: number;
        timeFromLast: number;
    };
    maxSpeed: number;
    deltaTime: number;
    bee: HTMLElement;
    accelerationData: Acceleration;
    private renderIntervalId;
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

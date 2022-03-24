import { Controls } from "./controls.js";
import { Acceleration } from "./pilotUtils.js";
export declare class Player {
    currY: number;
    currX: number;
    element: HTMLElement;
    maxSpeed: number;
    deltaTime: number;
    accelerationData: Acceleration;
    circleHue: number;
    private id;
    private wayX;
    private timeFromLastCircle;
    private circleFrequency;
    private scale;
    private controls;
    constructor(element: HTMLElement, controls: Controls);
    start(): void;
    stop(): void;
    private frame;
    private flipElementIfShould;
    private calculateNewX;
    private calculateNewY;
    private correctAcceleration;
}

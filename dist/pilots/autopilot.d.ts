import { Bee } from "../bee.js";
import { Controls } from "../controls.js";
export declare class Autopilot {
    private static readonly delta;
    private static readonly distanceFromWall;
    private static readonly delay;
    private static readonly possibleKeys;
    running: boolean;
    private intervalId;
    private readonly currPressedKey;
    private readonly currDelay;
    private readonly elapsed;
    private readonly controls;
    private readonly bee;
    constructor(bee: Bee, controls: Controls);
    start(): void;
    stop(): void;
    private isXOutOfBounds;
    private isYOutOfBounds;
    private updateX;
    private resetX;
    private executeNewX;
    private updateY;
    private resetY;
    private executeNewY;
    private getRandomDelay;
}

import { Controls } from "./controls.js";
import { Bee } from "./bee.js";
export declare class ScreenSaverPilot {
    readonly player: Bee;
    private static readonly delta;
    private id;
    private controls;
    running: boolean;
    constructor(bee: Bee, controls: Controls);
    start(): void;
    stop(): void;
    private frame;
}

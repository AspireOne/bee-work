import { Controls } from "../controls.js";
import { Bee } from "../bee.js";
export declare class ScreenSaverPilot {
    running: boolean;
    private controls;
    private readonly bee;
    private id;
    constructor(bee: Bee, controls: Controls);
    start(): void;
    stop(): void;
    private frame;
}

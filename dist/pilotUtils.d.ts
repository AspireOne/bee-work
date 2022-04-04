import { Types } from "./types.js";
export declare enum WayX {
    LEFT = 0,
    RIGHT = 1,
    NONE = 2
}
export declare class Acceleration {
    currAccelerationX: number;
    currAccelerationY: number;
    readonly acceleration: Types.ModifiableProp;
    constructor(acceleration?: number);
}

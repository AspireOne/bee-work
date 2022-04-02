import { Utils } from "./utils.js";
import ModifiableProp = Utils.ModifiableProp;
export declare enum WayX {
    LEFT = 0,
    RIGHT = 1,
    NONE = 2
}
export declare class Acceleration {
    currAccelerationX: number;
    currAccelerationY: number;
    readonly acceleration: ModifiableProp;
    constructor(acceleration?: number);
}

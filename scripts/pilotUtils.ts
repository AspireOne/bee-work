import {Utils} from "./utils.js";
import {Types} from "./types.js";

export enum WayX {
    LEFT,
    RIGHT,
    NONE
}

export class Acceleration {
    public currAccelerationX = 0;
    public currAccelerationY = 0;
    public readonly acceleration: Types.ModifiableProp = {
        value: 0.12,
        values: {
            default: 0.12,
            min: 0.05,
            max: 2
        }
    }

    constructor(acceleration = 0.12) {
        this.acceleration.value = acceleration;
    }
}
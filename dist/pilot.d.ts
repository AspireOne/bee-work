export declare enum WayX {
    LEFT = 0,
    RIGHT = 1,
    NONE = 2
}
export declare class Acceleration {
    private static readonly divisionFactor;
    currAccelerationX: number;
    currAccelerationY: number;
    private _acceleration;
    private _accelerationDivided;
    constructor(acceleration?: number);
    get acceleration(): number;
    set acceleration(newAcceleration: number);
    get accelerationDivided(): number;
}

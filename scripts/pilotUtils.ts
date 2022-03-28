export enum WayX {
    LEFT,
    RIGHT,
    NONE
}

export class Acceleration {
    private static readonly divisionFactor = 1.8;
    public currAccelerationX = 0;
    public currAccelerationY = 0;
    private _acceleration: number = 0.12;
    private _accelerationDivided: number = 0;

    constructor(acceleration = 0.12) {
        this.acceleration = acceleration;
    }

    public get acceleration() {
        return this._acceleration;
    }

    public set acceleration(newAcceleration) {
        this._acceleration = newAcceleration;
        this._accelerationDivided = newAcceleration / Acceleration.divisionFactor;
    }

    public get accelerationDivided() {
        return this._accelerationDivided;
    }
}
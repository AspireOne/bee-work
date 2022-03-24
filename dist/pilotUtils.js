export var WayX;
(function (WayX) {
    WayX[WayX["LEFT"] = 0] = "LEFT";
    WayX[WayX["RIGHT"] = 1] = "RIGHT";
    WayX[WayX["NONE"] = 2] = "NONE";
})(WayX || (WayX = {}));
export class Acceleration {
    constructor(acceleration = 0.12) {
        this.currAccelerationX = 0;
        this.currAccelerationY = 0;
        this._acceleration = 0.12;
        this._accelerationDivided = 0;
        this.acceleration = acceleration;
    }
    get acceleration() {
        return this._acceleration;
    }
    set acceleration(newAcceleration) {
        this._acceleration = newAcceleration;
        this._accelerationDivided = newAcceleration / Acceleration.divisionFactor;
    }
    get accelerationDivided() {
        return this._accelerationDivided;
    }
}
Acceleration.divisionFactor = 1.8;
//# sourceMappingURL=pilotUtils.js.map
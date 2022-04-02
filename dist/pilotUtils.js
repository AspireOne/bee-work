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
        this.acceleration = {
            value: 0.12,
            values: {
                default: 0.12,
                min: 0.05,
                max: 2
            }
        };
        this.acceleration.value = acceleration;
    }
}
//# sourceMappingURL=pilotUtils.js.map
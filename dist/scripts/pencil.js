import { Utils } from "./utils/utils.js";
var htmlToElement = Utils.htmlToElement;
import { VanishingCircle } from "./vanishingCircle.js";
export class Pencil {
    constructor(designOverlay, circleProps, closeCallback) {
        this.speed = {
            value: 12,
            values: {
                min: 4,
                max: 50,
                default: 12,
            }
        };
        this.designing = false;
        this.points = [];
        this.index = 0;
        this.running = false;
        if (Pencil.instanceCreated)
            throw new Error("Pencil can be created only once");
        Pencil.instanceCreated = true;
        this.closeCallback = closeCallback;
        this.circleProps = circleProps;
        this.designOverlay = designOverlay;
        this.designOverlay.addEventListener("mousedown", (e) => this.designing = true);
        this.designOverlay.addEventListener("mouseup", (e) => {
            this.designing = false;
            this.clearDesignOverlay();
            if (this.points.length > Pencil.minPoints)
                this.startEffect();
            else
                this.stop();
        });
        this.designOverlay.addEventListener("mousemove", (e) => {
            if (this.designing)
                this.placePointAndSmooth(e);
        });
        document.addEventListener("keydown", (e) => {
            if (this.running && e.key === "Escape")
                this.stop();
        });
    }
    start() {
        this.designOverlay.style.display = "block";
        this.running = true;
    }
    changeSpeed(speed) {
        this.speed.value = speed;
    }
    stop() {
        this.index = 0;
        this.running = false;
        this.points = [];
        this.designing = false;
        this.clearDesignOverlay();
        if (this.closeCallback)
            this.closeCallback();
    }
    startEffect() {
        if (!this.running)
            return;
        if (this.index >= this.points.length)
            this.index = 0;
        const props = {
            duration: this.circleProps.durationShift.value,
            initialOpacity: 1,
            size: this.circleProps.size.value,
            hue: this.circleProps.hue.value
        };
        new VanishingCircle(this.points[this.index], props).show();
        this.index += this.speed.value;
        requestAnimationFrame(this.startEffect.bind(this));
    }
    clearDesignOverlay() {
        this.designOverlay.innerHTML = "<h2>[ ESC ]</h2>";
        this.designOverlay.style.display = "none";
    }
    placePointAndSmooth(e) {
        var _a;
        const point = { x: e.clientX, y: e.clientY };
        const prevPoint = (_a = this.points[this.points.length - 1]) !== null && _a !== void 0 ? _a : point;
        const pointsBetween = Pencil.getPointsBetween(point, prevPoint);
        pointsBetween.forEach(p => {
            this.points.push(p);
            this.placePoint(p);
        });
        this.placePoint(point);
        this.points.push(point);
    }
    placePoint(point) {
        const pointElement = htmlToElement(`<img src="../resources/circle-blurred.png" class="point">`);
        pointElement.classList.add("point");
        Object.assign(pointElement.style, {
            left: point.x + "px",
            top: point.y + "px",
        });
        this.designOverlay.appendChild(pointElement);
    }
    static getPointsBetween(a, b) {
        const points = [];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        for (let i = 1; i < steps; ++i) {
            const x = b.x + (dx / steps) * i;
            const y = b.y + (dy / steps) * i;
            points.push({ x, y });
        }
        return points;
    }
}
Pencil.instanceCreated = false;
Pencil.minPoints = 20;
//# sourceMappingURL=pencil.js.map
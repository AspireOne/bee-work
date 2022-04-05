import { Utils } from "../utils.js";
var htmlToElement = Utils.htmlToElement;
import { VanishingCircle } from "../vanishingCircle.js";
export class Pencil {
    constructor(canvas) {
        this.drawing = false;
        this.points = [];
        this.canvas = canvas;
        this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
        this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));
        this.canvas.addEventListener("mousemove", (e) => {
            if (this.drawing)
                this.putPoint(e);
        });
    }
    start() {
        this.obtainShape();
    }
    obtainShape() {
        this.points = [];
        this.canvas.style.display = "block";
    }
    startDrawing() {
        let index = 0;
        const props = { duration: 1000, initialOpacity: 1, size: 60, hue: 0 };
        setInterval(() => {
            if (index >= this.points.length)
                index = 0;
            new VanishingCircle(this.points[index += 5], props).show();
        }, 1);
    }
    handleMouseDown(e) {
        this.drawing = true;
    }
    handleMouseUp(e) {
        this.drawing = false;
        this.canvas.style.display = "none";
        this.startDrawing();
    }
    putPoint(e) {
        var _a;
        const point = { x: e.clientX, y: e.clientY };
        const prevPoint = (_a = this.points[this.points.length - 1]) !== null && _a !== void 0 ? _a : point;
        const pointsBetween = this.getPointsBetween(point, prevPoint);
        pointsBetween.forEach(p => {
            this.points.push(p);
            this.placePoint(p);
        });
        this.placePoint(point);
        this.points.push(point);
    }
    placePoint(point) {
        const pointElement = htmlToElement(`<img src="../resources/circle-blurred.png" class="point"></img>`);
        pointElement.classList.add("point");
        Object.assign(pointElement.style, {
            left: point.x + "px",
            top: point.y + "px",
        });
        this.canvas.appendChild(pointElement);
    }
    getPointsBetween(a, b) {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        const sx = b.x < a.x ? 1 : -1;
        const sy = b.y < a.y ? 1 : -1;
        let err = dx - dy;
        if (err < 10)
            return [];
        const points = [];
        while (true) {
            points.push(a);
            if (a.x === b.x && a.y === b.y)
                break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                a.x -= sx;
            }
            if (e2 < dx) {
                err += dx;
                a.y += sy;
            }
        }
        return points;
    }
}
//# sourceMappingURL=pencil.js.map
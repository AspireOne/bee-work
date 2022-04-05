import {Utils} from "../utils.js";
import htmlToElement = Utils.htmlToElement;
import {Types} from "../types.js";
import Point = Types.Point;
import {VanishingCircle} from "../vanishingCircle.js";

export class Pencil {
    private readonly canvas: HTMLDivElement;
    private drawing: boolean = false;
    private points: Point[] = [];
    
    constructor(canvas: HTMLDivElement) {
        this.canvas = canvas;
        this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
        this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));
        this.canvas.addEventListener("mousemove", (e) => {
            if (this.drawing)
                this.putPoint(e);
        });
    }

    public start() {
        this.obtainShape();
    }

    private obtainShape() {
        this.points = [];
        this.canvas.style.display = "block";
    }

    private startDrawing() {
        let index = 0;
        const props = {duration: 1000, initialOpacity: 1, size: 60, hue: 0};
        setInterval(() => {
            if (index >= this.points.length)
                index = 0;

            new VanishingCircle(this.points[index += 5], props).show();
        }, 1);
    }

    private handleMouseDown(e: MouseEvent) {
        this.drawing = true;
    }

    private handleMouseUp(e: MouseEvent) {
        this.drawing = false;
        this.canvas.style.display = "none";
        this.startDrawing();
    }

    private putPoint(e: MouseEvent) {
        const point = {x: e.clientX, y: e.clientY };
        const prevPoint = this.points[this.points.length - 1] ?? point;
        const pointsBetween = this.getPointsBetween(point, prevPoint);
        pointsBetween.forEach(p => {
            this.points.push(p);
            this.placePoint(p);
        });

        this.placePoint(point);
        this.points.push(point);
    }

    private placePoint(point: Point) {
        const pointElement = htmlToElement(`<img src="../resources/circle-blurred.png" class="point"></img>`);
        pointElement.classList.add("point");
        Object.assign(pointElement.style, {
            left: point.x + "px",
            top: point.y + "px",
        });
        this.canvas.appendChild(pointElement);
    }

    private getPointsBetween(a: Point, b: Point): Point[] {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        const sx = b.x < a.x ? 1 : -1;
        const sy = b.y < a.y ? 1 : -1;
        let err = dx - dy;
        if (err < 10)
            return [];

        const points: Point[] = [];

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
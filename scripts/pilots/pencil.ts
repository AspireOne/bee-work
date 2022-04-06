import {Utils} from "../utils.js";
import htmlToElement = Utils.htmlToElement;
import {Types} from "../types.js";
import Point = Types.Point;
import {VanishingCircle} from "../vanishingCircle.js";
import ModifiableProp = Types.ModifiableProp;
import {Bee} from "../bee.js";

export class Pencil {
    private static instanceCreated: boolean = false;
    private static minPoints = 20;
    private readonly delta = 10;
    public readonly speed: ModifiableProp = {
        value: 12,
        values: {
            min: 4,
            max: 50,
            default: 12,
        }
    };
    private readonly circleProps: Bee.CircleProps;
    private readonly designOverlay: HTMLDivElement;
    private readonly closeCallback?: () => void;
    private designing: boolean = false;
    private points: Point[] = [];
    private intervalId = 0;
    public running: boolean = false;
    
    constructor(designOverlay: HTMLDivElement, circleProps: Bee.CircleProps, closeCallback?: () => void) {
        if (Pencil.instanceCreated) {
            throw new Error("Pencil can be created only once");
            return;
        }
        Pencil.instanceCreated = true;

        this.closeCallback = closeCallback;
        this.circleProps = circleProps;
        this.designOverlay = designOverlay;
        
        this.designOverlay.addEventListener("mousedown", (e) => {
            this.designing = true;
        });
        this.designOverlay.addEventListener("mouseup", (e) => {
            this.designing = false;
            this.clearDesignOverlay();
            console.log(this.points.length);
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

    public start() {
        this.designOverlay.style.display = "block";
        this.running = true;
    }

    public changeSpeed(speed: number) {
        this.speed.value = speed;
        if (this.running) {
            clearInterval(this.intervalId);
            this.startEffect();
        }
    }

    public stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = 0;
        }

        this.running = false;
        this.points = [];
        this.designing = false;
        this.clearDesignOverlay();
        if (this.closeCallback)
            this.closeCallback();
    }

    private startEffect() {
        let index = 0;
        this.intervalId = setInterval(() => {
            if (index >= this.points.length)
                index = 0;

            const props: VanishingCircle.Props = {
                duration: this.circleProps.durationShift.value,
                initialOpacity: 1,
                size: this.circleProps.size.value,
                hue: this.circleProps.hue.value
            };

            new VanishingCircle(this.points[index], props).show();
            index += this.speed.value;
        }, this.delta);
    }
    
    private clearDesignOverlay() {
        this.designOverlay.innerHTML = "";
        this.designOverlay.style.display = "none";
    }

    private placePointAndSmooth(e: MouseEvent) {
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
        this.designOverlay.appendChild(pointElement);
    }

    private getPointsBetween(a: Point, b: Point): Point[] {
        const points: Point[] = [];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        for (let i = 1; i < steps; ++i) {
            const x = b.x + (dx / steps) * i;
            const y = b.y + (dy / steps) * i;
            points.push({x, y});
        }
        return points;
    }
}
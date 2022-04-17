import Props = VanishingCircle.Props;
import {Types} from "./types.js";

/** A module containing the props that are passed to VanishingCircle. */
export module VanishingCircle {
    export type Props = {
        duration: number,
        initialOpacity: number,
        size: number,
        hue: number
    }
}

export class VanishingCircle {
    /** The delta time - interval frequency - frequency of circle updates (updates to the circle's opacity). */
    private static readonly delta = 20;
    /** The threshold where a filter won't be applied to the circle because it would cause lagging. */
    private static readonly doNotApplyFilterThreshold = 4005;
    /** A global array of all circles that are currently active. This is used to update them all at once in a global
    interval to prevent a lot of intervals running at once. */
    private static circles: VanishingCircle[] = [];
    /** The static image element of the circle which is cloned every time a circle is created. */
    private static image = VanishingCircle.createBaseCircleElement();
    /** The ID of the global interval / update loop. */
    private static intervalId: number | null = null;

    /** The point at which the circle will be created. */
    public readonly point = {x: 0, y: 0 };
    /** The properties of the circle. */
    public readonly props: Props = {
        duration: 400,
        initialOpacity: 0.8,
        size: 60,
        hue: 0
    }

    /** The step size of the opacity update (step = 0.2 | opacity: 0.9 -> 0.7 -> 0.5...). */
    private readonly decreaseStep: number;
    /** The cloned circle element. */
    private readonly clone: HTMLElement;
    /** A boolean indicating whether a filter should be applied. */
    private readonly applyFilter: boolean;

    /** A marker to indicate whether the circle has finished and is ready for removal. */
    public disabled: boolean = false;
    /** The total time elapsed since the circle was created. */
    private elapsed = 0;
    /** The opacity during the previous update. */
    private prevOpacity: number;

    public constructor(point: Types.Point, props: Partial<Props>) {
        this.props = {...this.props, ...props};
        this.point = point;
        /* I didn't find a way to apply the filter to a lot of circles simulatenously without making the website laggy, so we'll
         just disable it if there's too many circles. */
        this.applyFilter = this.props.duration < VanishingCircle.doNotApplyFilterThreshold;
        this.decreaseStep = this.props.initialOpacity / (this.props.duration / VanishingCircle.delta);
        this.prevOpacity = this.props.initialOpacity;

        this.clone = this.createClone();
    }

    /**
     * Runs an interval that updates the opacity of circles in the global array every delta time.
     * This is used to update all circles at once to prevent a lot of intervals running at once.
     * If the interval is already running, this function does nothing.
     */
    public static runLoop() {
        if (this.intervalId != null)
            return;

        requestAnimationFrame((timestamp) => this.step(timestamp));
        //this.intervalId = setInterval(() => this.update(this.delta), VanishingCircle.delta);
    }

    private static step(timestamp: number) {
        // TODO: Finish this.
        this.update(17);
        requestAnimationFrame((timestamp) => this.step(timestamp));
    }

    /** Stops the interval that updates the opacity of circles every delta time. */
    public static stopLoop() {
        if (this.intervalId == null)
            return;

        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    public static update(delta: number) {
        this.circles = this.circles.filter(circle => !circle.disabled);
        this.circles.forEach(circle => circle.updateOpacity(delta));
    }

    /** Clones the original image element of the circle and sets it's properties based on the properties of this object. */
    private createClone() {
        let clone = VanishingCircle.image.cloneNode(false) as HTMLElement;
        const offset = (this.props.size - 80) / 2;
        Object.assign(clone.style, {
            left: this.point.x - offset + "px",
            top: this.point.y - offset + "px",
            width: this.props.size + "px",
            height: this.props.size + "px",
            opacity: this.props.initialOpacity,
            filter: this.applyFilter && this.props.hue != 0 ? `hue-rotate(${this.props.hue}deg)` : '',
        });

        return clone;
    }

    /** Creates an image element with the circle image. */
    private static createBaseCircleElement() {
        const circle = new Image();
        circle.classList.add("circle");
        circle.src = "../resources/circle-blurred.png";

        return circle;
    }

    /** Appends the circle to the DOM and adds itself to the global array, including itself in the global update loop. */
    public show() {
        document.body.appendChild(this.clone);
        VanishingCircle.circles.push(this);
    }

    private updateOpacity(delta: number) {
        this.elapsed += delta;
        let newOpacity = this.prevOpacity - this.decreaseStep;

        if (this.elapsed >= this.props.duration && !this.disabled) {
            this.disabled = true;
            this.clone.style.display = "none";
            document.body.removeChild(this.clone);
        } else {
            this.prevOpacity = newOpacity;
            this.clone.style.opacity = newOpacity.toString();
        }
    }
}
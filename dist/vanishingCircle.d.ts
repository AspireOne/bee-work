import Props = VanishingCircle.Props;
import { Types } from "./types.js";
/** A module containing the props that are passed to VanishingCircle. */
export declare module VanishingCircle {
    type Props = {
        duration: number;
        initialOpacity: number;
        size: number;
        hue: number;
    };
}
export declare class VanishingCircle {
    /** The delta time - interval frequency - frequency of circle updates (updates to the circle's opacity). */
    private static readonly delta;
    /** The threshold where a filter won't be applied to the circle because it would cause lagging. */
    private static readonly doNotApplyFilterThreshold;
    /** A global array of all circles that are currently active. This is used to update them all at once in a global
    interval to prevent a lot of intervals running at once. */
    private static circles;
    /** The static image element of the circle which is cloned every time a circle is created. */
    private static image;
    /** The ID of the global interval / update loop. */
    private static intervalId;
    /** The point at which the circle will be created. */
    readonly point: {
        x: number;
        y: number;
    };
    /** The properties of the circle. */
    readonly props: Props;
    /** The step size of the opacity update (step = 0.2 | opacity: 0.9 -> 0.7 -> 0.5...). */
    private readonly decreaseStep;
    /** The cloned circle element. */
    private readonly clone;
    /** A boolean indicating whether a filter should be applied. */
    private readonly applyFilter;
    /** A marker to indicate whether the circle has finished and is ready for removal. */
    disabled: boolean;
    /** The total time elapsed since the circle was created. */
    private elapsed;
    /** The opacity during the previous update. */
    private prevOpacity;
    constructor(point: Types.Point, props: Partial<Props>);
    /**
     * Runs an interval that updates the opacity of circles in the global array every delta time.
     * This is used to update all circles at once to prevent a lot of intervals running at once.
     * If the interval is already running, this function does nothing.
     */
    static runLoop(): void;
    /** Stops the interval that updates the opacity of circles every delta time. */
    static stopLoop(): void;
    /** Clones the original image element of the circle and sets it's properties based on the properties of this object. */
    private createClone;
    /** Creates an image element with the circle image. */
    private static createBaseCircleElement;
    /** Appends the circle to the DOM and adds itself to the global array, including itself in the global update loop. */
    show(): void;
    private updateOpacity;
}

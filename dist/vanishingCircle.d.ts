import Props = VanishingCircle.Props;
import { Utils } from "./utils.js";
export declare module VanishingCircle {
    type Props = {
        duration: number;
        initialOpacity: number;
        size: number;
        hue: number;
    };
}
export declare class VanishingCircle {
    private static readonly delta;
    private static readonly doNotApplyFilterThreshold;
    private static circles;
    private static image;
    private static intervalId;
    readonly point: {
        x: number;
        y: number;
    };
    readonly props: Props;
    private readonly decreaseStep;
    private readonly clone;
    private readonly applyFilter;
    disabled: boolean;
    private elapsed;
    private prevOpacity;
    constructor(point: Utils.Point, props: Partial<Props>);
    static runLoop(): void;
    static stopLoop(): void;
    private createClone;
    private static createBaseCircleElement;
    show(): void;
    updateVanish(): void;
}

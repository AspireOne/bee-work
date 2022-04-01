export declare class VanishingCircle {
    private static circles;
    disabled: boolean;
    readonly vanishIn: number;
    readonly x: number;
    readonly y: number;
    readonly initialOpacity: number;
    readonly width: number;
    readonly hue: number;
    private static baseElement;
    private static readonly delta;
    private elapsed;
    private static intervalId;
    private prevOpacity;
    private readonly decreaseBy;
    private readonly clone;
    private readonly applyFilter;
    private readonly doNotApplyFilterThreshold;
    constructor(x: number, y: number, vanishIn?: number, size?: number, initialOpacity?: number, hue?: number);
    static runLoop(): void;
    static stopLoop(): void;
    private createClone;
    private createBaseCircleElement;
    show(): void;
    updateVanish(): void;
}

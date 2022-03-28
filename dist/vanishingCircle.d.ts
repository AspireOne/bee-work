export declare class VanishingCircle {
    private static circles;
    disabled: boolean;
    readonly vanishIn: number;
    readonly x: string;
    readonly y: string;
    readonly initialOpacity: number;
    readonly width: number;
    readonly hue: number;
    private static baseElement;
    private static readonly delta;
    private elapsed;
    private prevOpacity;
    private readonly decreaseBy;
    private readonly clone;
    private readonly applyFilter;
    private readonly doNotApplyFilterThreshold;
    constructor(x: number, y: number, vanishIn?: number, size?: number, initialOpacity?: number, hue?: number);
    static runLoop(): void;
    private createClone;
    private createBaseCircleElement;
    show(): void;
    updateVanish(): void;
}

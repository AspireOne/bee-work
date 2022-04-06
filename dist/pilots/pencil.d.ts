import { Types } from "../types.js";
import ModifiableProp = Types.ModifiableProp;
import { Bee } from "../bee.js";
export declare class Pencil {
    private static instanceCreated;
    private static minPoints;
    private readonly delta;
    readonly speed: ModifiableProp;
    private readonly circleProps;
    private readonly designOverlay;
    private readonly closeCallback?;
    private designing;
    private points;
    private intervalId;
    running: boolean;
    constructor(designOverlay: HTMLDivElement, circleProps: Bee.CircleProps, closeCallback?: () => void);
    start(): void;
    changeSpeed(speed: number): void;
    stop(): void;
    private startEffect;
    private clearDesignOverlay;
    private placePointAndSmooth;
    private placePoint;
    private getPointsBetween;
}

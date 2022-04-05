export declare class Pencil {
    private readonly canvas;
    private drawing;
    private points;
    constructor(canvas: HTMLDivElement);
    start(): void;
    private obtainShape;
    private startDrawing;
    private handleMouseDown;
    private handleMouseUp;
    private putPoint;
    private placePoint;
    private getPointsBetween;
}

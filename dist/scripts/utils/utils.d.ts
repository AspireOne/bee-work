import { Types } from "../types";
export declare module Utils {
    import Point = Types.Point;
    const randomIntFromInterval: (min: number, max: number) => number;
    const isTouchDevice: () => boolean;
    function collides(a: DOMRect, b: DOMRect): boolean;
    function isOutOfDoc(pos: Point, size: number): boolean;
    function isBetween(value: number, min: number, max: number): boolean;
    function isZero(rect: DOMRect): boolean;
    function isPointInsideRect(x: number, y: number, rect: DOMRect): boolean;
    function resetAnimation(element: HTMLElement): void;
    function htmlToElement(html: string): HTMLElement;
    function addValueToSliders(): void;
}

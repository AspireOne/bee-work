export declare module Utils {
    type Point = {
        x: number;
        y: number;
    };
    type Range = {
        min: number;
        max: number;
    };
    type ModifiableProp = {
        value: number;
        values: {
            readonly default: number;
            readonly min: number;
            readonly max: number;
        };
    };
    type SavedModifiableProp = {
        [p: string]: number;
    };
    const getAvailableHeight: () => number;
    const getAvailableWidth: () => number;
    const randomIntFromInterval: (min: number, max: number) => number;
    const isTouchDevice: () => boolean;
    function collides(a: DOMRect, b: DOMRect): boolean;
    function isPointInsideRect(x: number, y: number, rect: DOMRect): boolean;
    function resetAnimation(element: HTMLElement): void;
    function htmlToElement(html: string): HTMLElement;
    function addValueToSliders(): void;
    function getWindowWidth(): number;
    function getWindowHeight(): number;
}

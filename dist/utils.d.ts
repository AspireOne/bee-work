export declare const getAvailableHeight: () => number;
export declare const getAvailableWidth: () => number;
export declare type Point = {
    x: number;
    y: number;
};
export declare const randomIntFromInterval: (min: number, max: number) => number;
export declare function collides(a: DOMRect, b: DOMRect): boolean;
export declare function isPointInsideRect(x: number, y: number, rect: DOMRect): boolean;
export declare function htmlToElement(html: string): HTMLElement;
export declare function addValueToSliders(): void;
export declare function getWindowWidth(): number;
export declare function getWindowHeight(): number;
export declare const isTouchDevice: () => boolean;

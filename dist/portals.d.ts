export declare class Portals {
    checkIntervalMs: number;
    checkMoveThreshold: number;
    lastBeeX: number;
    id: number;
    portals: [HTMLElement, null | (() => void)][];
    bee: HTMLElement;
    constructor(bee: HTMLElement);
    startChecking(): void;
    stopChecking(): void;
    setTargetPortalsDisplay(visible: boolean): void;
    generateRandomPortal(timeout: number): void;
    drawPoint(x: number, y: number): void;
    createPortal(x: number, y: number): HTMLImageElement;
    getPortalsFromDoc(): HTMLImageElement[];
    addPortal(portal: HTMLElement, action: null | (() => void)): void;
}

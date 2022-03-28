export declare class Portals {
    portalAnimation: {
        step: number;
        speed: number;
    };
    outPortalDuration: number;
    checkInterval: number;
    checkMoveThreshold: number;
    lastBeeX: number;
    id: number;
    portals: [HTMLElement, null | (() => void)][];
    bee: HTMLElement;
    constructor(bee: HTMLElement);
    startChecking(): void;
    stopChecking(): void;
    setTargetPortalsDisplay(visible: boolean): void;
    generateRandomPortal(timeout: number, canvas: HTMLCanvasElement): void;
    handlePortalTouched(portal: HTMLImageElement, portX: number, portY: number, canvas: HTMLCanvasElement): void;
    removePortal(portal: HTMLImageElement): void;
    drawPoint(x: number, y: number, canvas: HTMLCanvasElement): void;
    placePortal(portal: HTMLImageElement, x: number, y: number): void;
    createPortal(): HTMLImageElement;
    getSidePortalsFromDoc(): HTMLImageElement[];
    addPortal(portal: HTMLElement, action: null | (() => void)): void;
}

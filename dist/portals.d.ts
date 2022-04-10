import collisionPortalProps = Portals.CollisionPortalProps;
export declare module Portals {
    type CollisionPortalProps = {
        collisionElement: HTMLElement;
        collisionAction?: () => void;
        target?: URL;
        noposition?: boolean;
    };
}
export declare class Portals {
    private appearAnimation;
    private checkInterval;
    private checkingId;
    private portals;
    bee: HTMLElement;
    constructor(bee: HTMLElement);
    startCheckingCollisions(): void;
    stopCheckingCollisions(): void;
    setSidePortalsDisplay(visible: boolean): void;
    generateRandomPortal(timeout: number, canvas: HTMLCanvasElement): void;
    private static drawPoint;
    private handlePortalTouched;
    removePortal(portal: HTMLElement): void;
    placePortal(portal: HTMLElement, x: number, y: number): void;
    private animateAppearance;
    createPortal(): HTMLElement;
    /** Registers all side portals in document for collision. */
    registerSidePortals(): void;
    registerPortal(props: collisionPortalProps): void;
}

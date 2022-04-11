import collisionPortalProps = Portals.CollisionPortalProps;
export declare module Portals {
    type CollisionPortalProps = {
        collisionElement: HTMLElement;
        onCollision?: () => void;
        target?: URL;
        noposition?: boolean;
    };
}
export declare class Portals {
    private appearAnimation;
    private bee;
    constructor(bee: HTMLElement);
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

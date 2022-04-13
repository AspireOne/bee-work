import CollidingObject = CollisionChecker.CollidingObject;
export declare module CollisionChecker {
    type CollidingObject = {
        element: HTMLElement;
        onCollisionEnter?: () => void;
        onCollisionLeave?: () => void;
    };
}
export declare class CollisionChecker {
    private static created;
    private readonly objects;
    private delta;
    private beeElement;
    private id;
    constructor(bee: HTMLElement);
    startChecking(): void;
    addObject: (object: CollidingObject) => number;
    Remove(objToRemove: HTMLElement): void;
}

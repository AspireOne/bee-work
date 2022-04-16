import CollidingObject = CollisionChecker.CollidingObject;
export declare module CollisionChecker {
    type CollidingObject = {
        element: HTMLElement;
        unremovable?: boolean;
        onCollisionEnter?: () => void;
        onCollisionLeave?: () => void;
    };
}
export declare class CollisionChecker {
    private static created;
    private readonly objects;
    delta: number;
    private beeElement;
    private id;
    constructor(bee: HTMLElement);
    startChecking(): void;
    add: (object: CollidingObject) => number;
    remove(objToRemove: HTMLElement): void;
}

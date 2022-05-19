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
    static readonly defaultDelta = 135;
    private readonly objects;
    private _delta;
    get delta(): number;
    set delta(value: number);
    private beeElement;
    private id;
    constructor(bee: HTMLElement);
    startChecking(): void;
    stopChecking(): void;
    add: (object: CollidingObject) => number;
    remove(objToRemove: HTMLElement): void;
}

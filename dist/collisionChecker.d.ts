import ObjectProps = CollisionChecker.ObjectProps;
export declare module CollisionChecker {
    type ObjectProps = {
        element: HTMLElement;
        onCollision: () => void;
    };
}
export declare class CollisionChecker {
    private static created;
    private objects;
    private delta;
    private beeElement;
    private id;
    constructor(bee: HTMLElement);
    startChecking(): void;
    addObject: (object: ObjectProps) => number;
    removeObject: (object: ObjectProps) => ObjectProps[];
}

import ObjectProps = CollisionChecker.ObjectProps;
export declare module CollisionChecker {
    type ObjectProps = {
        element: HTMLElement;
        onCollisionEnter?: () => void;
        onCollisionLeave?: () => void;
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
    removeObject: (object: ObjectProps) => {
        lastCollision?: boolean | undefined;
        isColliding?: boolean | undefined;
        props: ObjectProps;
    }[];
}

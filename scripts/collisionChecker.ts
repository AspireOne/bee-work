import {Bee} from "./bee.js";
import {Utils} from "./utils.js";
import ObjectProps = CollisionChecker.ObjectProps;

// Singleton.
export module CollisionChecker {
    export type ObjectProps = {
        element: HTMLElement,
        onCollisionEnter?: () => void,
        onCollisionLeave?: () => void,
    };
}

export class CollisionChecker {
    private static created: boolean = false;
    private objects: {lastCollision?: boolean, isColliding?: boolean, props: ObjectProps}[] = [];
    private delta = 150;
    private beeElement: HTMLElement;
    private id = 0;

    constructor(bee: HTMLElement) {
        if (CollisionChecker.created)
            throw new Error("Only one instance of collision checker can be created.");
        CollisionChecker.created = true;

        this.beeElement = bee;
    }

    public startChecking() {
        if (this.id)
            return;

        this.id = setInterval(() => {
            this.objects.forEach(obj => {
                const rect = obj.props.element.getBoundingClientRect();

                if (Utils.isZero(rect)) {
                    this.removeObject(obj.props);
                    return;
                }

                obj.lastCollision = false;
                if (Utils.collides(rect, this.beeElement.getBoundingClientRect())) {
                    obj.lastCollision = true;
                    if (obj.isColliding)
                        return;

                    obj.isColliding = true;
                    if (obj.props.onCollisionEnter)
                        obj.props.onCollisionEnter();
                }
                if (!obj.lastCollision && obj.isColliding) {
                    obj.isColliding = false;
                    if (obj.props.onCollisionLeave)
                        obj.props.onCollisionLeave();
                }
            });

        }, this.delta);
    }

/*    public stopChecking() {
        clearInterval(this.id);
        this.id = 0;
    }*/

    public addObject = (object: ObjectProps) => this.objects.push({props: object});
    public removeObject = (object: ObjectProps) => this.objects.splice(this.objects.indexOf({props: object}), 1);
}
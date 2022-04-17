import {Bee} from "./bee.js";
import {Utils} from "./utils.js";
import CollidingObject = CollisionChecker.CollidingObject;
import {collisionChecker} from "./global";
import isZero = Utils.isZero;

// Singleton.
export module CollisionChecker {
    export type CollidingObject = {
        element: HTMLElement,
        unremovable?: boolean
        onCollisionEnter?: () => void,
        onCollisionLeave?: () => void,
    };
}

export class CollisionChecker {
    private static created: boolean = false;
    public static readonly defaultDelta = 135;
    private readonly objects: {
        state: {
            lastCollision?: boolean,
            isColliding?: boolean
        };
        object: CollidingObject;
    }[] = [];
    private _delta = CollisionChecker.defaultDelta;

    public get delta(): number {
        return this._delta;
    }

    public set delta(value: number) {
        this._delta = value;
        this.stopChecking();
        this.startChecking();
    }

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
            this.objects.forEach(object => {
                const rect = object.object.element.getBoundingClientRect();
                object.state.lastCollision = false;

                if (Utils.isZero(rect))
                    return;

                if (Utils.collides(rect, this.beeElement.getBoundingClientRect())) {
                    if (window.getComputedStyle(object.object.element).opacity === "0")
                        return;
                    object.state.lastCollision = true;
                    if (object.state.isColliding)
                        return;

                    object.state.isColliding = true;
                    if (object.object.onCollisionEnter) {
                        object.object.onCollisionEnter();
                    }
                }

                if (!object.state.lastCollision && object.state.isColliding) {
                    object.state.isColliding = false;
                    if (object.object.onCollisionLeave)
                        object.object.onCollisionLeave();
                }
            });

        }, this.delta);
    }

    public stopChecking() {
        clearInterval(this.id);
        this.id = 0;
    }

    public add = (object: CollidingObject) => this.objects.push({object: object, state: {}});
    public remove(objToRemove: HTMLElement) {
        for (let i = 0; i < this.objects.length; ++i) {
            if (this.objects[i].object.element === objToRemove && !this.objects[i].object.unremovable) {
                this.objects.splice(i, 1);
                break;
            }
        }
    };
}

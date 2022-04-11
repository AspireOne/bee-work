import {Bee} from "./bee.js";
import {Utils} from "./utils.js";
import ObjectProps = CollisionChecker.ObjectProps;

// Singleton.
export module CollisionChecker {
    export type ObjectProps = {
        element: HTMLElement,
        onCollision: () => void
    };
}

export class CollisionChecker {
    private static created: boolean = false;
    private objects: ObjectProps[] = [];
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
                if (Utils.collides(obj.element.getBoundingClientRect(), this.beeElement.getBoundingClientRect())) {
                    obj.onCollision();
                }
            });
        }, this.delta);
    }

/*    public stopChecking() {
        clearInterval(this.id);
        this.id = 0;
    }*/

    public addObject = (object: ObjectProps) => this.objects.push(object);
    public removeObject = (object: ObjectProps) => this.objects.splice(this.objects.indexOf(object), 1);
}
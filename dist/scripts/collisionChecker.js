import { Utils } from "./utils/utils.js";
export class CollisionChecker {
    constructor(bee) {
        this.objects = [];
        this._delta = CollisionChecker.defaultDelta;
        this.id = 0;
        this.add = (object) => this.objects.push({ object: object, state: {} });
        if (CollisionChecker.created)
            throw new Error("Only one instance of collision checker can be created.");
        CollisionChecker.created = true;
        this.beeElement = bee;
    }
    get delta() {
        return this._delta;
    }
    set delta(value) {
        this._delta = value;
        this.stopChecking();
        this.startChecking();
    }
    startChecking() {
        if (this.id)
            return;
        this.id = window.setInterval(() => {
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
    stopChecking() {
        clearInterval(this.id);
        this.id = 0;
    }
    remove(objToRemove) {
        for (let i = 0; i < this.objects.length; ++i) {
            if (this.objects[i].object.element === objToRemove && !this.objects[i].object.unremovable) {
                this.objects.splice(i, 1);
                break;
            }
        }
    }
    ;
}
CollisionChecker.created = false;
CollisionChecker.defaultDelta = 135;
//# sourceMappingURL=collisionChecker.js.map
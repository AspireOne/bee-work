import { Utils } from "./utils.js";
export class CollisionChecker {
    constructor(bee) {
        this.objects = [];
        this.delta = 130;
        this.id = 0;
        /*    public stopChecking() {
                clearInterval(this.id);
                this.id = 0;
            }*/
        this.add = (object) => this.objects.push({ object: object, state: {} });
        if (CollisionChecker.created)
            throw new Error("Only one instance of collision checker can be created.");
        CollisionChecker.created = true;
        this.beeElement = bee;
    }
    startChecking() {
        if (this.id)
            return;
        this.id = setInterval(() => {
            this.objects.forEach(object => {
                const rect = object.object.element.getBoundingClientRect();
                object.state.lastCollision = false;
                if (window.getComputedStyle(object.object.element).opacity === "0")
                    return;
                if (Utils.collides(rect, this.beeElement.getBoundingClientRect())) {
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
    remove(objToRemove) {
        for (let i = 0; i < this.objects.length; ++i) {
            if (this.objects[i].object.element === objToRemove && !this.objects[i].object.unremovable) {
                this.objects.splice(i, 1);
                break;
            }
        }
        /*const index = this.objects.findIndex(obj => obj.object.element === objToRemove);
        if (index !== -1)
            this.objects.splice(index, 1);*/
    }
    ;
}
CollisionChecker.created = false;
//# sourceMappingURL=collisionChecker.js.map
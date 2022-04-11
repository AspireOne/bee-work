import { Utils } from "./utils.js";
export class CollisionChecker {
    constructor(bee) {
        this.objects = [];
        this.delta = 150;
        this.id = 0;
        /*    public stopChecking() {
                clearInterval(this.id);
                this.id = 0;
            }*/
        this.addObject = (object) => this.objects.push(object);
        this.removeObject = (object) => this.objects.splice(this.objects.indexOf(object), 1);
        if (CollisionChecker.created)
            throw new Error("Only one instance of collision checker can be created.");
        CollisionChecker.created = true;
        this.beeElement = bee;
    }
    startChecking() {
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
}
CollisionChecker.created = false;
//# sourceMappingURL=collisionChecker.js.map
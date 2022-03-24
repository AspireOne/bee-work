export class VanishingCircle {
    constructor(x, y, vanishIn = 400, size = 60, initialOpacity = 0.8, hue = 0) {
        this.disabled = false;
        this.elapsed = 0;
        this.applyFilter = true;
        this.doNotApplyFilterThreshold = 1000;
        this.vanishIn = vanishIn;
        /* I didn't find a way to apply the filter to a lot of circles simulatenously without making the website laggy, so we'll
         just disable it if there's too many circles. */
        this.applyFilter = this.vanishIn < this.doNotApplyFilterThreshold;
        this.hue = hue;
        this.initialOpacity = initialOpacity;
        this.x = x + "px";
        this.y = y + "px";
        this.decreaseBy = initialOpacity / (vanishIn / VanishingCircle.delta);
        this.prevOpacity = initialOpacity;
        this.width = size + "px";
        this.clone = this.createClone();
    }
    static runLoop() {
        setInterval(() => {
            VanishingCircle.circles = VanishingCircle.circles.filter(item => !item.disabled);
            VanishingCircle.circles.forEach(circle => circle.updateVanish());
        }, VanishingCircle.delta);
    }
    createClone() {
        if (VanishingCircle.originalCircle === undefined)
            VanishingCircle.originalCircle = document.getElementById("js-circle");
        let clone = VanishingCircle.originalCircle.cloneNode(true);
        Object.assign(clone.style, {
            left: this.x,
            top: this.y,
            width: this.width,
            display: "block",
            opacity: this.initialOpacity,
            filter: this.applyFilter ? `blur(3px) hue-rotate(${this.hue}deg)` : '',
        });
        return clone;
    }
    show() {
        document.body.appendChild(this.clone);
        VanishingCircle.circles.push(this);
    }
    updateVanish() {
        this.elapsed += VanishingCircle.delta;
        let newOpacity = this.prevOpacity - this.decreaseBy;
        if (this.elapsed >= this.vanishIn && !this.disabled) {
            this.disabled = true;
            this.clone.style.display = "none";
            document.body.removeChild(this.clone);
        }
        else {
            this.prevOpacity = newOpacity;
            this.clone.style.opacity = newOpacity.toString();
        }
    }
}
VanishingCircle.circles = [];
VanishingCircle.delta = 20;
//# sourceMappingURL=vanishingCircle.js.map
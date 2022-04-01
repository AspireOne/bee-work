export class VanishingCircle {
    constructor(x, y, vanishIn = 400, size = 60, initialOpacity = 0.8, hue = 0) {
        this.disabled = false;
        this.elapsed = 0;
        this.applyFilter = true;
        this.doNotApplyFilterThreshold = 4005;
        this.vanishIn = vanishIn;
        /* I didn't find a way to apply the filter to a lot of circles simulatenously without making the website laggy, so we'll
         just disable it if there's too many circles. */
        this.applyFilter = this.vanishIn < this.doNotApplyFilterThreshold;
        this.hue = hue;
        this.initialOpacity = initialOpacity;
        this.x = x;
        this.y = y;
        this.decreaseBy = initialOpacity / (vanishIn / VanishingCircle.delta);
        this.prevOpacity = initialOpacity;
        this.width = size;
        this.clone = this.createClone();
    }
    static runLoop() {
        if (this.intervalId !== null)
            return;
        this.intervalId = setInterval(() => {
            VanishingCircle.circles = VanishingCircle.circles.filter(item => !item.disabled);
            VanishingCircle.circles.forEach(circle => circle.updateVanish());
        }, VanishingCircle.delta);
    }
    static stopLoop() {
        if (this.intervalId === null)
            return;
        clearInterval(this.intervalId);
        this.intervalId = null;
    }
    createClone() {
        if (VanishingCircle.baseElement === undefined)
            VanishingCircle.baseElement = this.createBaseCircleElement();
        let clone = VanishingCircle.baseElement.cloneNode(false);
        const offset = (this.width - 80) / 2;
        Object.assign(clone.style, {
            left: this.x - offset + "px",
            top: this.y - offset + "px",
            width: this.width + "px",
            height: this.width + "px",
            opacity: this.initialOpacity,
            filter: this.applyFilter ? `blur(3px) hue-rotate(${this.hue}deg)` : '',
        });
        return clone;
    }
    createBaseCircleElement() {
        const circle = new Image();
        circle.classList.add("circle");
        circle.src = "../resources/circle.png";
        return circle;
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
VanishingCircle.intervalId = null;
//# sourceMappingURL=vanishingCircle.js.map
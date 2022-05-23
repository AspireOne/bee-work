export class VanishingCircle {
    constructor(point, props) {
        /** The point at which the circle will be created. */
        this.point = { x: 0, y: 0 };
        /** The properties of the circle. */
        this.props = {
            duration: 400,
            initialOpacity: 0.8,
            size: 60,
            hue: 0
        };
        /** A marker to indicate whether the circle has finished and is ready for removal. */
        this.disabled = false;
        /** The total time elapsed since the circle was created. */
        this.elapsed = 0;
        this.props = Object.assign(Object.assign({}, this.props), props);
        this.point = point;
        /* I didn't find a way to apply the filter to a lot of circles simulatenously without making the website laggy, so we'll
         just disable it if there's too many circles. */
        this.applyFilter = this.props.duration < VanishingCircle.doNotApplyFilterThreshold;
        this.decreaseStep = this.props.initialOpacity / (this.props.duration / VanishingCircle.delta);
        this.prevOpacity = this.props.initialOpacity;
        this.clone = this.createClone();
    }
    /**
     * Runs an interval that updates the opacity of circles in the global array every delta time.
     * This is used to update all circles at once to prevent a lot of intervals running at once.
     * If the interval is already running, this function does nothing.
     */
    static runLoop() {
        if (this.intervalId != null)
            return;
        requestAnimationFrame((timestamp) => this.step(timestamp));
        //this.intervalId = window.setInterval(() => this.update(this.delta), VanishingCircle.delta);
    }
    static step(timestamp) {
        // TODO: Finish this.
        this.update(17);
        requestAnimationFrame((timestamp) => this.step(timestamp));
    }
    /** Stops the interval that updates the opacity of circles every delta time. */
    static stopLoop() {
        if (this.intervalId == null)
            return;
        clearInterval(this.intervalId);
        this.intervalId = null;
    }
    static update(delta) {
        this.circles = this.circles.filter(circle => !circle.disabled);
        this.circles.forEach(circle => circle.updateOpacity(delta));
    }
    /** Clones the original image element of the circle and sets it's properties based on the properties of this object. */
    createClone() {
        let clone = VanishingCircle.image.cloneNode(false);
        const offset = (this.props.size - 80) / 2;
        Object.assign(clone.style, {
            left: this.point.x - offset + "px",
            top: this.point.y - offset + "px",
            width: this.props.size + "px",
            height: this.props.size + "px",
            opacity: this.props.initialOpacity,
            filter: this.applyFilter && this.props.hue != 0 ? `hue-rotate(${this.props.hue}deg)` : '',
        });
        return clone;
    }
    /** Creates an image element with the circle image. */
    static createBaseCircleElement() {
        const circle = new Image();
        circle.classList.add("circle");
        circle.src = "../resources/circle-blurred.png";
        return circle;
    }
    /** Appends the circle to the DOM and adds itself to the global array, including itself in the global update loop. */
    show() {
        document.body.appendChild(this.clone);
        VanishingCircle.circles.push(this);
    }
    updateOpacity(delta) {
        this.elapsed += delta;
        let newOpacity = this.prevOpacity - this.decreaseStep;
        if (this.elapsed >= this.props.duration && !this.disabled) {
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
/** The delta time - interval frequency - frequency of circle updates (updates to the circle's opacity). */
VanishingCircle.delta = 20;
/** The threshold where a filter won't be applied to the circle because it would cause lagging. */
VanishingCircle.doNotApplyFilterThreshold = 4005;
/** A global array of all circles that are currently active. This is used to update them all at once in a global
interval to prevent a lot of intervals running at once. */
VanishingCircle.circles = [];
/** The static image element of the circle which is cloned every time a circle is created. */
VanishingCircle.image = VanishingCircle.createBaseCircleElement();
/** The ID of the global interval / update loop. */
VanishingCircle.intervalId = null;
//# sourceMappingURL=vanishingCircle.js.map
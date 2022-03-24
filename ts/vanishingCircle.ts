export class VanishingCircle {
    private static circles: VanishingCircle[] = [];
    public disabled: boolean = false;
    public readonly vanishIn: number;
    public readonly x: string;
    public readonly y: string;
    public readonly initialOpacity: number;
    public readonly width: string;
    public readonly hue: number;
    private static originalCircle: HTMLElement;
    private static readonly delta = 20;
    private elapsed = 0;
    private prevOpacity: number;
    private readonly decreaseBy: number;
    private readonly clone: HTMLElement;
    private readonly applyFilter: boolean = true;
    private readonly doNotApplyFilterThreshold = 1000;
    public constructor(x: number, y: number, vanishIn = 400, size = 60, initialOpacity = 0.8, hue = 0) {
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

    public static runLoop() {
        setInterval(() => {
            VanishingCircle.circles = VanishingCircle.circles.filter(item => !item.disabled);
            VanishingCircle.circles.forEach(circle => circle.updateVanish());
        }, VanishingCircle.delta);
    }

    private createClone() {
        if (VanishingCircle.originalCircle === undefined)
            VanishingCircle.originalCircle = document.getElementById("js-circle") as HTMLElement

        let clone = VanishingCircle.originalCircle.cloneNode(true) as HTMLElement;

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

    public show() {
        document.body.appendChild(this.clone);
        VanishingCircle.circles.push(this);
    }

    public updateVanish() {
        this.elapsed += VanishingCircle.delta;
        let newOpacity = this.prevOpacity - this.decreaseBy;

        if (this.elapsed >= this.vanishIn && !this.disabled) {
            this.disabled = true;
            this.clone.style.display = "none";
            document.body.removeChild(this.clone);
        } else {
            this.prevOpacity = newOpacity;
            this.clone.style.opacity = newOpacity.toString();
        }
    }
}
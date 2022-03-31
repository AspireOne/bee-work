export class VanishingCircle {
    private static circles: VanishingCircle[] = [];
    public disabled: boolean = false;
    public readonly vanishIn: number;
    public readonly x: string;
    public readonly y: string;
    public readonly initialOpacity: number;
    public readonly width: number;
    public readonly hue: number;
    private static baseElement: HTMLImageElement;
    private static readonly delta = 20;
    private elapsed = 0;
    private static intervalId: number | null = null;
    private prevOpacity: number;
    private readonly decreaseBy: number;
    private readonly clone: HTMLElement;
    private readonly applyFilter: boolean = true;
    private readonly doNotApplyFilterThreshold = 4005;
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
        this.width = size;

        this.clone = this.createClone();
    }

    public static runLoop() {
        if (this.intervalId !== null)
            return;

        this.intervalId = setInterval(() => {
            VanishingCircle.circles = VanishingCircle.circles.filter(item => !item.disabled);
            VanishingCircle.circles.forEach(circle => circle.updateVanish());
        }, VanishingCircle.delta);
    }

    public static stopLoop() {
        if (this.intervalId === null)
            return;

        clearInterval(this.intervalId as number);
        this.intervalId = null;
    }

    private createClone() {
        if (VanishingCircle.baseElement === undefined)
            VanishingCircle.baseElement = this.createBaseCircleElement();

        let clone = VanishingCircle.baseElement.cloneNode(true) as HTMLElement;
        Object.assign(clone.style, {
            left: this.x,
            top: this.y,
            width: this.width + "px",
            height: this.width + "px",
            opacity: this.initialOpacity,
            filter: this.applyFilter ? `blur(3px) hue-rotate(${this.hue}deg)` : '',
        });

        return clone;
    }

    private createBaseCircleElement() {
        const circle = new Image();
        circle.classList.add("circle");
        circle.src = "../resources/circle.png";

        return circle;
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
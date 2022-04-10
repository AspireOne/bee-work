import {Utils} from "./utils.js";
import collisionPortalProps = Portals.CollisionPortalProps;
import {Controls} from "./controls.js";

export module Portals {
    export type CollisionPortalProps = {
        collisionElement: HTMLElement,
        collisionAction?: () => void,
        target?: URL,
        noposition?: boolean
    };
}

export class Portals {
    private appearAnimation = {
        step: 4,
        speed: 10,
        duration: 450
    }
    private checkInterval = 150;
    private checkingId = 0;
    private portals: collisionPortalProps[] = [];
    public bee;

    constructor(bee: HTMLElement) {
        this.bee = bee;
    }

    // TODO: Abstract out collision checking. We can use it for whatever.
    public startCheckingCollisions() {
        if (this.checkingId)
            return;

        this.checkingId = setInterval(() => {
            this.portals.forEach(portal => {
                if (Utils.collides(portal.collisionElement.getBoundingClientRect(), this.bee.getBoundingClientRect())) {
                    if (portal.collisionAction)
                        portal.collisionAction();

                    if (portal.target && !portal.noposition) {
                        portal.target.searchParams.append("left", Controls.keys.left.pressed + "");
                        portal.target.searchParams.append("right", Controls.keys.right.pressed + "");
                        portal.target.searchParams.append("floss", Controls.keys.floss.pressed + "");
                    }

                    if (portal.target)
                        window.location.assign(portal.target); //  TODO: window.location.replace(portal.target);
                }
            });
        }, this.checkInterval);
    }

    public stopCheckingCollisions() {
        clearInterval(this.checkingId);
        this.checkingId = 0;
    }

    public setSidePortalsDisplay(visible: boolean) {
        for (let portalDiv of document.getElementsByClassName("side-portal"))
            (portalDiv as HTMLElement).style.display = visible ? "" : "none";
    }

    public generateRandomPortal(timeout: number, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const locationOffset = 100;

        const maxX = document.body.clientWidth - locationOffset;
        const maxY = document.body.clientHeight - locationOffset;
        const minX = locationOffset;
        const minY = locationOffset;

        const y = Utils.randomIntFromInterval(minY, maxY);
        const x = Utils.randomIntFromInterval(minX, maxX);

        const portY = Utils.randomIntFromInterval(minY, maxY);
        const portX = Utils.randomIntFromInterval(minX, maxX);

        const portal = this.createPortal();
        this.placePortal(portal, x, y);

        Portals.drawPoint(portX, portY, canvas);

        const timeoutId = setTimeout(() => {
            this.removePortal(portal);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, timeout);

        const props = {
            collisionElement: portal,
            collisionAction: () => {
                clearTimeout(timeoutId);
                this.handlePortalTouched(portal, portX, portY, canvas);
            }
        };
        this.portals.push(props);
    }

    private static drawPoint(x: number, y:number, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const radius = 15;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(91, 80, 155, 0.35)';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(63,55,105,0.35)';
        ctx.stroke();
    }

    private handlePortalTouched(portal: HTMLElement, portX: number, portY: number, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.removePortal(portal);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.bee.style.left = portX + "px";
        this.bee.style.top = portY + "px";
        const endPortal = this.createPortal();
        this.placePortal(endPortal, portX, portY);
        setTimeout(() => this.removePortal(endPortal), this.appearAnimation.duration);
    }

    public removePortal(portal: HTMLElement) {
        let width = portal.clientWidth;
        let height = portal.clientHeight;

        const id = setInterval(() => {
            if (width > this.appearAnimation.step) {
                portal.style.width = (width -= this.appearAnimation.step) + "px";
                portal.style.left = (portal.getBoundingClientRect().left + this.appearAnimation.step / 2) + "px";
            }
            if (height > this.appearAnimation.step) {
                portal.style.height = (height -= this.appearAnimation.step) + "px";
                portal.style.top = (portal.getBoundingClientRect().top + this.appearAnimation.step / 2) + "px";
            }

            if (width <= this.appearAnimation.step && height <= this.appearAnimation.step) {
                portal.remove();
                clearInterval(id);
                return;
            }
        }, this.appearAnimation.speed);
    }

    public placePortal(portal: HTMLElement, x: number, y: number) {
        Object.assign(portal.style, {
            left: x + "px",
            top: y + "px",
        });
        document.body.appendChild(portal);
        this.animateAppearance(portal);
    }

    private animateAppearance(portal: HTMLElement) {
        const targetWidth = portal.clientWidth;
        const targetHeight = portal.clientHeight;
        portal.style.width = "0px";
        portal.style.height = "0px";
        let width = 0;
        let height = 0;

        const id = setInterval(() => {
            if (width < targetWidth - this.appearAnimation.step) {
                portal.style.width = (width += this.appearAnimation.step) + "px";
                portal.style.left = (portal.getBoundingClientRect().left - this.appearAnimation.step / 2) + "px";
            }
            if (height < targetHeight - this.appearAnimation.step) {
                portal.style.height = (height += this.appearAnimation.step) + "px";
                portal.style.top = (portal.getBoundingClientRect().top - this.appearAnimation.step/2) + "px";
            }

            if (width >= targetWidth - (this.appearAnimation.step - 1) && height >= targetHeight - (this.appearAnimation.step - 1)) {
                clearInterval(id);
                return;
            }
        }, this.appearAnimation.speed);
    }

    public createPortal(): HTMLElement {
        const portal = document.createElement("div");
        //portal.src = "../resources/portal.png";
        portal.classList.add("portal", "unselectable");
        portal.onselectstart = () => false;

        return portal;
    }

    /** Registers all side portals in document for collision. */
    public registerSidePortals(): void {
        for (let portalDiv of document.getElementsByClassName("side-portal")) {
            const collisionElement = (portalDiv.getElementsByTagName('img')[0] as HTMLElement);

            let target = portalDiv.getAttribute("target");
            if (!target)
                continue;

            const noPosition = portalDiv.getAttribute("noposition") === "" || portalDiv.getAttribute("noposition") === "true";

            // If target ends with a slash, remove it.
            /*if (!target.endsWith("/"))
                target += "/";*/

            const url = new URL(target, window.location.href);

            if (!noPosition && portalDiv.classList.contains("portal-right"))
                url.searchParams.append("from", "right");
            else if (!noPosition && portalDiv.classList.contains("portal-left"))
                url.searchParams.append("from", "left");

            this.portals.push({collisionElement: collisionElement, target: url, noposition: noPosition});
        }
    }

    public registerPortal(props: collisionPortalProps): void {
        this.portals.push(props);
    }
}
import {Utils} from "./utils.js";

export class Portals {
    portalAnimation = {
        step: 4,
        speed: 10
    }
    outPortalDuration = 450;
    checkInterval = 100;
    checkMoveThreshold = 25;
    lastBeeX;
    id = -1;
    public portals: [HTMLElement, null | (() => void)][] = [];
    bee;

    constructor(bee: HTMLElement) {
        this.bee = bee;
        this.lastBeeX = bee.getBoundingClientRect().left;
    }

    public startChecking() {
        if (this.id != -1)
            return;

        this.id = setInterval(() => {
            const beeX = this.bee.getBoundingClientRect().left;
            if (Math.abs(this.lastBeeX - beeX) < this.checkMoveThreshold)
                return;

            this.lastBeeX = beeX;
            this.portals.forEach(p => {
                if (Utils.collides(p[0].getBoundingClientRect(), this.bee.getBoundingClientRect())) {
                    if (p[1])
                        p[1]();

                    const target = p[0].getAttribute("target") as string;
                    if (target)
                        window.location.replace(target);
                }
            });
        }, this.checkInterval);
    }

    public stopChecking() {
        clearInterval(this.id);
        this.id = -1;
    }

    public setTargetPortalsDisplay(visible: boolean) {
        for (let portalDiv of document.getElementsByClassName("side-portal")) {
            const img = portalDiv.getElementsByTagName('img')[0];
            if (img.getAttribute("target") === null)
                continue;

            (portalDiv as HTMLElement).style.display = visible ? "block" : "none";
        }
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

        this.drawPoint(portX, portY, canvas);

        const timeoutId = setTimeout(() => {
            this.removePortal(portal);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, timeout);

        this.portals.push([portal, () => {
            clearTimeout(timeoutId);
            this.handlePortalTouched(portal, portX, portY, canvas);
        }]);
    }

    handlePortalTouched(portal: HTMLImageElement, portX: number, portY: number, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.removePortal(portal);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.bee.style.left = portX + "px";
        this.bee.style.top = portY + "px";
        const endPortal = this.createPortal();
        this.placePortal(endPortal, portX, portY);
        setTimeout(() => this.removePortal(endPortal), this.outPortalDuration);
    }

    removePortal(portal: HTMLImageElement) {
        let width = portal.clientWidth;
        let height = portal.clientHeight;

        const id = setInterval(() => {
            if (width > this.portalAnimation.step) {
                portal.style.width = (width -= this.portalAnimation.step) + "px";
                portal.style.left = (portal.getBoundingClientRect().left + this.portalAnimation.step / 2) + "px";
            }
            if (height > this.portalAnimation.step) {
                portal.style.height = (height -= this.portalAnimation.step) + "px";
                portal.style.top = (portal.getBoundingClientRect().top + this.portalAnimation.step / 2) + "px";
            }

            if (width <= this.portalAnimation.step && height <= this.portalAnimation.step) {
                portal.remove();
                clearInterval(id);
                return;
            }
        }, this.portalAnimation.speed);
    }

    drawPoint(x: number, y:number, canvas: HTMLCanvasElement) {
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

    public placePortal(portal: HTMLImageElement, x: number, y: number) {
        Object.assign(portal.style, {
            left: x + "px",
            top: y + "px",
        });
        document.body.appendChild(portal);

        const targetWidth = portal.clientWidth;
        const targetHeight = portal.clientHeight;
        let width = 0;
        let height = 0;
        portal.style.width = "0px";
        portal.style.height = "0px";

        const id = setInterval(() => {
            if (width < targetWidth - this.portalAnimation.step) {
                portal.style.width = (width += this.portalAnimation.step) + "px";
                portal.style.left = (portal.getBoundingClientRect().left - this.portalAnimation.step / 2) + "px";
            }
            if (height < targetHeight - this.portalAnimation.step) {
                portal.style.height = (height += this.portalAnimation.step) + "px";
                portal.style.top = (portal.getBoundingClientRect().top - this.portalAnimation.step/2) + "px";
            }

            if (width >= targetWidth - (this.portalAnimation.step - 1) && height >= targetHeight - (this.portalAnimation.step - 1)) {
                clearInterval(id);
                return;
            }
        }, this.portalAnimation.speed);
    }

    public createPortal() {
        const portal = new Image();
        portal.src = "../resources/portal.png";
        portal.classList.add("portal", "unselectable");
        portal.onselectstart = () => false;

        return portal;
    }

    public getSidePortalsFromDoc() {
        const portals = [];
        for (let portalDiv of document.getElementsByClassName("side-portal"))
            portals.push(portalDiv.getElementsByTagName('img')[0]);
        return portals;
    }

    public addPortal(portal: HTMLElement, action: null | (() => void)) {
        this.portals.push([portal, action]);
    }
}
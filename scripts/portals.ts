import {collides, getAvailableHeight, getAvailableWidth, randomIntFromInterval} from "./utils.js";
import {canvas, ctx} from "./global.js";

export class Portals {
    checkIntervalMs = 100;
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
                if (collides(p[0].getBoundingClientRect(), this.bee.getBoundingClientRect())) {
                    if (p[1])
                        p[1]();

                    const target = p[0].getAttribute("target") as string;
                    if (target)
                        window.location.replace(target);
                }
            });
        }, this.checkIntervalMs);
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

    public generateRandomPortal(timeout: number) {
        const offset = 100;
        const maxX = getAvailableWidth() - offset;
        const minX = offset;
        const maxY = getAvailableHeight() - offset;
        const minY = offset;

        const y = randomIntFromInterval(minY, maxY);
        const x = randomIntFromInterval(minX, maxX);

        const portY = randomIntFromInterval(minY, maxY);
        const portX = randomIntFromInterval(minX, maxX);

        const portal = this.createPortal(x, y);
        this.drawPoint(portX + 60, portY + 60);
        
        document.body.appendChild(portal);
        this.portals.push([portal, () => {
            portal.remove();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.bee.style.left = portX + "px";
            this.bee.style.top = portY + "px";
            const endPortal = this.createPortal(portX, portY);
            document.body.appendChild(endPortal);
            setTimeout(() => endPortal.remove(), 1000);
        }]);
        setTimeout(() => {
            portal.remove();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, timeout);
    }

    drawPoint(x: number, y:number) {
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

    public createPortal(x: number, y: number) {
        const portal = new Image();
        portal.src = "../resources/portal.png",
            portal.classList.add("portal");
        Object.assign(portal.style, {
            left: x + "px",
            top: y + "px",
        });
        return portal;
    }

    public getPortalsFromDoc() {
        const portals = [];
        for (let portalDiv of document.getElementsByClassName("portal"))
            portals.push(portalDiv.getElementsByTagName('img')[0]);
        return portals;
    }

    public addPortal(portal: HTMLElement, action: null | (() => void)) {
        this.portals.push([portal, action]);
    }
}
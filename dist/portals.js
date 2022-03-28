import { collides, getAvailableHeight, getAvailableWidth, randomIntFromInterval } from "./utils.js";
import { canvas, ctx } from "./global.js";
export class Portals {
    constructor(bee) {
        this.checkIntervalMs = 100;
        this.checkMoveThreshold = 25;
        this.id = -1;
        this.portals = [];
        this.bee = bee;
        this.lastBeeX = bee.getBoundingClientRect().left;
    }
    startChecking() {
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
                    const target = p[0].getAttribute("target");
                    if (target)
                        window.location.replace(target);
                }
            });
        }, this.checkIntervalMs);
    }
    stopChecking() {
        clearInterval(this.id);
        this.id = -1;
    }
    setTargetPortalsDisplay(visible) {
        for (let portalDiv of document.getElementsByClassName("side-portal")) {
            const img = portalDiv.getElementsByTagName('img')[0];
            if (img.getAttribute("target") === null)
                continue;
            portalDiv.style.display = visible ? "block" : "none";
        }
    }
    generateRandomPortal(timeout) {
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
    drawPoint(x, y) {
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
    createPortal(x, y) {
        const portal = new Image();
        portal.src = "../resources/portal.png",
            portal.classList.add("portal");
        Object.assign(portal.style, {
            left: x + "px",
            top: y + "px",
        });
        return portal;
    }
    getPortalsFromDoc() {
        const portals = [];
        for (let portalDiv of document.getElementsByClassName("portal"))
            portals.push(portalDiv.getElementsByTagName('img')[0]);
        return portals;
    }
    addPortal(portal, action) {
        this.portals.push([portal, action]);
    }
}
//# sourceMappingURL=portals.js.map
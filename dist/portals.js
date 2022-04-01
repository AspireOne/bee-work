import { collides, getAvailableHeight, getAvailableWidth, randomIntFromInterval } from "./utils.js";
export class Portals {
    constructor(bee) {
        this.portalAnimation = {
            step: 4,
            speed: 10
        };
        this.outPortalDuration = 450;
        this.checkInterval = 100;
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
        }, this.checkInterval);
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
    generateRandomPortal(timeout, canvas) {
        const ctx = canvas.getContext('2d');
        const locationOffset = 100;
        const maxX = getAvailableWidth() - locationOffset;
        const maxY = getAvailableHeight() - locationOffset;
        const minX = locationOffset;
        const minY = locationOffset;
        const y = randomIntFromInterval(minY, maxY);
        const x = randomIntFromInterval(minX, maxX);
        const portY = randomIntFromInterval(minY, maxY);
        const portX = randomIntFromInterval(minX, maxX);
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
    handlePortalTouched(portal, portX, portY, canvas) {
        const ctx = canvas.getContext('2d');
        this.removePortal(portal);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.bee.style.left = portX + "px";
        this.bee.style.top = portY + "px";
        const endPortal = this.createPortal();
        this.placePortal(endPortal, portX, portY);
        setTimeout(() => this.removePortal(endPortal), this.outPortalDuration);
    }
    removePortal(portal) {
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
    drawPoint(x, y, canvas) {
        const ctx = canvas.getContext("2d");
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
    placePortal(portal, x, y) {
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
                portal.style.top = (portal.getBoundingClientRect().top - this.portalAnimation.step / 2) + "px";
            }
            if (width >= targetWidth - (this.portalAnimation.step - 1) && height >= targetHeight - (this.portalAnimation.step - 1)) {
                clearInterval(id);
                return;
            }
        }, this.portalAnimation.speed);
    }
    createPortal() {
        const portal = new Image();
        portal.src = "../resources/portal.png";
        portal.classList.add("portal", "unselectable");
        portal.onselectstart = () => false;
        return portal;
    }
    getSidePortalsFromDoc() {
        const portals = [];
        for (let portalDiv of document.getElementsByClassName("side-portal"))
            portals.push(portalDiv.getElementsByTagName('img')[0]);
        return portals;
    }
    addPortal(portal, action) {
        this.portals.push([portal, action]);
    }
}
//# sourceMappingURL=portals.js.map
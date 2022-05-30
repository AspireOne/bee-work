import { Utils } from "./utils/utils.js";
import { Controls } from "./controls.js";
import { collisionChecker } from "./global.js";
export class Portals {
    constructor(bee) {
        this.appearAnimation = {
            step: 4,
            speed: 10,
            duration: 450
        };
        this.bee = bee;
    }
    setSidePortalsDisplay(visible) {
        for (let portalDiv of document.getElementsByClassName("side-portal"))
            portalDiv.style.display = visible ? "" : "none";
    }
    generateRandomPortal(timeout, canvas, bee) {
        const ctx = canvas.getContext('2d');
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
        const timeoutId = window.setTimeout(() => {
            this.removePortal(portal);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, timeout);
        const props = {
            collisionElement: portal,
            onCollision: () => {
                clearTimeout(timeoutId);
                this.handlePortalTouched(portal, portX, portY, canvas, bee);
            }
        };
        this.registerPortal(props);
    }
    static drawPoint(x, y, canvas) {
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
    handlePortalTouched(portal, portX, portY, canvas, bee) {
        const ctx = canvas.getContext('2d');
        this.removePortal(portal);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bee.currPos = { x: portX, y: portY };
        const endPortal = this.createPortal();
        this.placePortal(endPortal, portX, portY);
        window.setTimeout(() => this.removePortal(endPortal), this.appearAnimation.duration);
    }
    removePortal(portal) {
        let width = portal.clientWidth;
        let height = portal.clientHeight;
        const id = window.setInterval(() => {
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
    placePortal(portal, x, y) {
        Object.assign(portal.style, {
            left: x + "px",
            top: y + "px",
        });
        document.body.appendChild(portal);
        this.animateAppearance(portal);
    }
    animateAppearance(portal) {
        const targetWidth = portal.clientWidth;
        const targetHeight = portal.clientHeight;
        portal.style.width = "0px";
        portal.style.height = "0px";
        let width = 0;
        let height = 0;
        const id = window.setInterval(() => {
            if (width < targetWidth - this.appearAnimation.step) {
                portal.style.width = (width += this.appearAnimation.step) + "px";
                portal.style.left = (portal.getBoundingClientRect().left - this.appearAnimation.step / 2) + "px";
            }
            if (height < targetHeight - this.appearAnimation.step) {
                portal.style.height = (height += this.appearAnimation.step) + "px";
                portal.style.top = (portal.getBoundingClientRect().top - this.appearAnimation.step / 2) + "px";
            }
            if (width >= targetWidth - (this.appearAnimation.step - 1) && height >= targetHeight - (this.appearAnimation.step - 1)) {
                clearInterval(id);
                return;
            }
        }, this.appearAnimation.speed);
    }
    createPortal() {
        const portal = document.createElement("div");
        //portal.src = "../resources/portal.png";
        portal.classList.add("portal", "unselectable");
        portal.onselectstart = () => false;
        return portal;
    }
    /** Registers all side portals in document for collision. */
    registerSidePortals() {
        for (let portalDiv of document.getElementsByClassName("side-portal")) {
            const collisionElement = portalDiv.getElementsByTagName('img')[0];
            let target = portalDiv.getAttribute("target");
            if (!target)
                continue;
            const noPosition = portalDiv.getAttribute("noposition") === "" || portalDiv.getAttribute("noposition") === "true";
            const url = new URL(target, window.location.href);
            if (!noPosition && portalDiv.classList.contains("portal-right"))
                url.searchParams.append("from", "right");
            else if (!noPosition && portalDiv.classList.contains("portal-left"))
                url.searchParams.append("from", "left");
            this.registerPortal({ collisionElement: collisionElement, target: url, noposition: noPosition });
        }
    }
    registerPortal(props) {
        const onCollision = () => {
            if (props.onCollision)
                props.onCollision();
            if (!props.target)
                return;
            if (!props.noposition) {
                props.target.searchParams.append("left", Controls.keys.left.pressed + "");
                props.target.searchParams.append("right", Controls.keys.right.pressed + "");
                props.target.searchParams.append("floss", Controls.keys.floss.pressed + "");
            }
            window.location.replace(props.target);
        };
        collisionChecker.add({ element: props.collisionElement, onCollisionEnter: onCollision.bind(this) });
    }
}
//# sourceMappingURL=portals.js.map
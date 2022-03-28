const widthIndicator = document.getElementById("js-width-indicator");
const heightIndicator = document.getElementById("js-height-indicator");
export const getAvailableHeight = () => heightIndicator === null || heightIndicator === void 0 ? void 0 : heightIndicator.clientHeight;
export const getAvailableWidth = () => widthIndicator === null || widthIndicator === void 0 ? void 0 : widthIndicator.clientWidth;
export const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export function collides(a, b) {
    return !(((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width)));
}
export function getWindowWidth() {
    return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
}
export function getWindowHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
}
export const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;
//# sourceMappingURL=utils.js.map
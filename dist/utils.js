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
export function isPointInsideRect(x, y, rect) {
    return (x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height);
}
export function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result.
    template.innerHTML = html;
    return template.content.firstChild;
}
export function addValueToSliders() {
    const containers = document.getElementsByClassName("slider-container");
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        const text = container.getElementsByTagName("span")[0];
        const slider = container.getElementsByClassName("slider")[0];
        if (!text || !slider)
            continue;
        slider.addEventListener("input", _ => text.innerText = slider.value);
        text.innerText = slider.value;
    }
}
export function getWindowWidth() {
    return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
}
export function getWindowHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
}
export const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;
//# sourceMappingURL=utils.js.map
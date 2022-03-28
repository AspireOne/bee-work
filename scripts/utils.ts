const widthIndicator = document.getElementById("js-width-indicator") as HTMLElement;
const heightIndicator = document.getElementById("js-height-indicator") as HTMLElement;
export const getAvailableHeight = () => heightIndicator?.clientHeight;
export const getAvailableWidth = () => widthIndicator?.clientWidth;

export const randomIntFromInterval = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export function collides(a: DOMRect, b: DOMRect) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}


export function getWindowWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

export function getWindowHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

export const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;
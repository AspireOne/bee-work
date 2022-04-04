export module Utils {
    export const randomIntFromInterval = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
    export const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;

    export function collides(a: DOMRect, b: DOMRect) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }

    export function isPointInsideRect(x: number, y: number, rect: DOMRect) {
        return (
            x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height
        );
    }

    export function resetAnimation(element: HTMLElement) {
        if (!element)
            return;

        element.style.animation = 'none';
        element.offsetHeight;
        element.style.animation = "";
    }

    export function htmlToElement(html: string): HTMLElement {
        const template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild as HTMLElement;
    }

    export function addValueToSliders() {
        const containers = document.getElementsByClassName("slider-container");
        for (let i = 0; i < containers.length; i++) {
            const container = containers[i] as HTMLDivElement;

            const text = container.getElementsByTagName("span")[0] as HTMLParagraphElement;
            const slider = container.getElementsByClassName("slider")[0] as HTMLInputElement;
            if (!text || !slider)
                continue;

            slider.addEventListener("input", _ => text.innerText = slider.value);
            text.innerText = slider.value;
        }
    }
}
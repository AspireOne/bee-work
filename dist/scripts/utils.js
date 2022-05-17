export var Utils;
(function (Utils) {
    Utils.randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    Utils.isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;
    function collides(a, b) {
        return !(a.y + a.height < b.y ||
            a.y > b.y + b.height ||
            a.x + a.width < b.x ||
            a.x > b.x + b.width);
    }
    Utils.collides = collides;
    function isOutOfDoc(pos, size) {
        return pos.y < -size || pos.x < -size
            || pos.y > document.body.clientHeight || pos.x > document.body.clientWidth;
    }
    Utils.isOutOfDoc = isOutOfDoc;
    function isBetween(value, min, max) {
        return value >= min && value <= max;
    }
    Utils.isBetween = isBetween;
    function isZero(rect) {
        return rect.x === 0 && rect.y === 0 && rect.width === 0 && rect.height === 0;
    }
    Utils.isZero = isZero;
    function isPointInsideRect(x, y, rect) {
        return (x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height);
    }
    Utils.isPointInsideRect = isPointInsideRect;
    function resetAnimation(element) {
        if (!element)
            return;
        element.style.animation = 'none';
        element.offsetHeight;
        element.style.animation = "";
    }
    Utils.resetAnimation = resetAnimation;
    function htmlToElement(html) {
        const template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }
    Utils.htmlToElement = htmlToElement;
    function addValueToSliders() {
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
    Utils.addValueToSliders = addValueToSliders;
})(Utils || (Utils = {}));
//# sourceMappingURL=utils.js.map
import { modules, portals } from "./global.js";
export var Games;
(function (Games) {
    modules.push(() => run());
    function run() {
        for (let portal of document.getElementsByClassName("game-circle")) {
            const props = {
                collisionElement: portal,
                target: new URL(portal.getAttribute("target"), window.location.href)
            };
            portals.registerPortal(props);
        }
    }
})(Games || (Games = {}));
//# sourceMappingURL=games.js.map
import {modules, portals} from "./global.js";
import {Portals} from "./portals.js";

export module Games {
    modules.push(() => run());

    function run() {
        for (let portal of document.getElementsByClassName("game-circle")) {
            const props: Portals.collisionPortalProps = {
                collisionElement: portal as HTMLElement,
                target: new URL(portal.getAttribute("target") as string)
            }
            portals.registerPortal(props);
        }
    }
}
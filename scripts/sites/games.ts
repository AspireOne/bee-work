import {modules, portals} from "../global.js";
import {Portals} from "../portals.js";
import {Types} from "../utils/types";
import {Utils} from "../utils/utils";

export module Games {
    import Point = Types.Point;
    import randomIntFromInterval = Utils.randomIntFromInterval;
    modules.push(run);

    function run() {
        for (let portal of document.getElementsByClassName("game-circle")) {
            const props: Portals.CollisionPortalProps = {
                collisionElement: portal as HTMLElement,
                target: new URL(portal.getAttribute("target") as string, window.location.href)
            }
            portals.registerPortal(props);
        }
    }
}
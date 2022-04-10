import {modules, portals} from "../global.js";
import {Utils} from "../utils.js";
import {Portals} from "../portals.js";

export module Game {
    modules.push(() => run());
    type Score = {
        name: string;
        timestamp: number;
    }

    function run() {
        const tableOnlineButt = document.getElementById("score-table-online-butt") as HTMLElement;
        const tableLocalButt = document.getElementById("score-table-local-butt") as HTMLElement;
        const playButt = document.getElementById("play-button") as HTMLElement;

        tableOnlineButt.addEventListener("mousedown", () => {
            tableLocalButt.classList.remove("on");
            tableOnlineButt.classList.add("on");
        });
        tableLocalButt.addEventListener("mousedown", () => {
            tableOnlineButt.classList.remove("on");
            tableLocalButt.classList.add("on");
        });

        const props: Portals.CollisionPortalProps = {
            collisionElement: playButt,
            collisionAction: () => {
                console.log("dasdsdasdas");
                playButt.classList.add("collided");
            },
        }
        portals.registerPortal(props);
    }

    export function getTableRow(score: Score, rank: number, scoreDataHTML: string): HTMLElement {
        const datetime = new Date(score.timestamp);
        const datetimeString = `${datetime.getDate()}.${datetime.getMonth() + 1}.${datetime.getFullYear()} ${datetime.getHours()}:${datetime.getMinutes()}`;
        const html = `
    <div class="score-table-row">
        <div class="side-by-side">
            <p class="score-rank${rank === 1 ? " first" : ""}">#${rank}</p>
            <div>
                <p class="score-name">${score.name}</p>
                <p class="score-date">${datetimeString}</p>
            </div>
            <div class="score-data">
                ${scoreDataHTML}
            </div>
        </div>
    </div>
        `;
        return Utils.htmlToElement(html);
    }
}
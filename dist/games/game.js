import { modules, portals } from "../global.js";
import { Utils } from "../utils.js";
export var Game;
(function (Game) {
    modules.push(() => run());
    function run() {
        const tableOnlineButt = document.getElementById("score-table-online-butt");
        const tableLocalButt = document.getElementById("score-table-local-butt");
        const playButt = document.getElementById("play-button");
        tableOnlineButt.addEventListener("mousedown", () => {
            tableLocalButt.classList.remove("on");
            tableOnlineButt.classList.add("on");
        });
        tableLocalButt.addEventListener("mousedown", () => {
            tableOnlineButt.classList.remove("on");
            tableLocalButt.classList.add("on");
        });
        const props = {
            collisionElement: playButt,
            collisionAction: () => {
                console.log("dasdsdasdas");
                playButt.classList.add("collided");
            },
        };
        portals.registerPortal(props);
    }
    function getTableRow(score, rank, scoreDataHTML) {
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
    Game.getTableRow = getTableRow;
})(Game || (Game = {}));
//# sourceMappingURL=game.js.map
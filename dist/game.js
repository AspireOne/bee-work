import { bee, collisionChecker, modules, portals } from "./global.js";
import { Utils } from "./utils.js";
export var Game;
(function (Game) {
    let gameDiv;
    let menu;
    let gameMenu;
    let gameMenuResumeButt;
    let gameMenuLeaveButt;
    let gameMenuShown = false;
    let game;
    let gameFunc;
    modules.push(run);
    function addGame(gameFunction) {
        if (game)
            throw new Error("Game was already assigned.");
        gameFunc = gameFunction;
    }
    Game.addGame = addGame;
    function run() {
        initializeMainMenu();
        game = gameFunc();
        gameMenu = document.getElementById("game-menu");
        gameMenuResumeButt = document.getElementById("resume-button");
        gameMenuLeaveButt = document.getElementById("leave-button");
        gameDiv = document.getElementById("game");
        document.addEventListener("keydown", (e) => {
            if (game.running && e.key === "Escape" && !e.repeat)
                gameMenuShown ? resumeGame() : pauseGame();
        });
        gameMenuResumeButt.addEventListener("click", () => resumeGame());
        gameMenuLeaveButt.addEventListener("click", () => leaveGame());
    }
    function startGame(counter) {
        gameDiv.style.display = "initial";
        menu.style.animation = "var(--menu-fade-out-animation)";
        portals.setSidePortalsDisplay(false);
        runCounter(counter);
    }
    function leaveGame() {
        resumeGame();
        game.stopGame();
        gameDiv.style.display = "none";
        menu.style.animation = "fade-in 1s forwards";
        portals.setSidePortalsDisplay(true);
        game = gameFunc();
    }
    function pauseGame() {
        gameMenuShown = true;
        bee.pauseUpdates = true;
        game.pauseGame();
        gameMenu.style.display = "flex";
        gameMenu.style.animation = "var(--game-menu-fadein-animation)";
    }
    function resumeGame() {
        gameMenuShown = false;
        bee.pauseUpdates = false;
        game.resumeGame();
        gameMenu.style.display = "none";
    }
    function runCounter(counter) {
        counter.style.display = "block";
        let num = 3;
        counter.innerText = num + "";
        const id = setInterval(() => {
            if (num === 1) {
                clearInterval(id);
                counter.style.display = "none";
                game.startGame();
            }
            counter.innerText = --num + "";
        }, 1000);
    }
    function initializeMainMenu() {
        menu = document.getElementById("menu");
        const tableOnlineButt = document.getElementById("score-table-online-butt");
        const tableLocalButt = document.getElementById("score-table-local-butt");
        const playButt = document.getElementById("play-button");
        const counter = document.getElementById("counter");
        tableOnlineButt.addEventListener("mousedown", () => {
            tableLocalButt.classList.remove("on");
            tableOnlineButt.classList.add("on");
        });
        tableLocalButt.addEventListener("mousedown", () => {
            tableOnlineButt.classList.remove("on");
            tableLocalButt.classList.add("on");
        });
        let play = { pressed: false };
        const props = {
            element: playButt,
            onCollisionEnter: () => {
                if (play.pressed || window.getComputedStyle(menu).getPropertyValue("opacity") === "0")
                    return;
                play.pressed = true;
                startGame(counter);
                setTimeout(() => play.pressed = false, 3000);
            },
        };
        collisionChecker.addObject(props);
    }
    function getScoreTableRow(score, rank, scoreDataHTML) {
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
    Game.getScoreTableRow = getScoreTableRow;
})(Game || (Game = {}));
//# sourceMappingURL=game.js.map
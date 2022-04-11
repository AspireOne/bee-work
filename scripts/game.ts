import {collisionChecker, modules, portals} from "./global.js";
import {Utils} from "./utils.js";
import {Portals} from "./portals.js";
import {CollisionChecker} from "./collisionChecker.js";

export module Game {
    import resetAnimation = Utils.resetAnimation;
    export type IGame = {
        startGame: () => void;
        stopGame: () => void;
        resumeGame: () => void;
        pauseGame: () => void;
        running: boolean;
    }
    type Score = {
        name: string;
        timestamp: number;
    }

    let menu: HTMLElement;
    let gameMenu: HTMLElement;
    let gameMenuResumeButt: HTMLElement;
    let gameMenuLeaveButt: HTMLElement;
    let gameMenuShown: boolean = false;
    let game: IGame;
    modules.push(run);

    export function addGame(gamee: IGame) {
        if (game)
            throw new Error("Game was already assigned.");

        game = gamee;
    }

    function run() {
        initializeMainMenu();
        gameMenu = document.getElementById("game-menu") as HTMLElement;
        gameMenuResumeButt = document.getElementById("resume-button") as HTMLElement;
        gameMenuLeaveButt = document.getElementById("leave-button") as HTMLElement;

        document.addEventListener("keyup", (e) => {
            if (game.running && e.key === "Escape")
                gameMenuShown ? hideGameMenu() : showGameMenu();
        });

        gameMenuResumeButt.addEventListener("click", () => hideGameMenu());
        gameMenuLeaveButt.addEventListener("click", () => {
            hideGameMenu();
            game.stopGame();
            menu.style.animation = "fade-in 1s forwards";
        });
    }

    function initializeMainMenu() {
        menu = document.getElementById("menu") as HTMLElement;
        const tableOnlineButt = document.getElementById("score-table-online-butt") as HTMLElement;
        const tableLocalButt = document.getElementById("score-table-local-butt") as HTMLElement;
        const playButt = document.getElementById("play-button") as HTMLElement;
        const counter = document.getElementById("counter") as HTMLElement;

        tableOnlineButt.addEventListener("mousedown", () => {
            tableLocalButt.classList.remove("on");
            tableOnlineButt.classList.add("on");
        });
        tableLocalButt.addEventListener("mousedown", () => {
            tableOnlineButt.classList.remove("on");
            tableLocalButt.classList.add("on");
        });

        let playPressed: boolean = false;
        const props: CollisionChecker.ObjectProps = {
            element: playButt,
            onCollisionEnter: () => {
                if (playPressed || window.getComputedStyle(menu).getPropertyValue("opacity") === "0")
                    return;
                playPressed = true;

                menu.style.animation = "var(--menu-fade-out-animation)";

                counter.style.display = "block";
                let num = 3;
                counter.innerText = num + "";
                const id = setInterval(() => {
                    if (num === 1) {
                        clearInterval(id);
                        counter.style.display = "none";
                        playPressed = false;
                        game.startGame();
                    }
                    counter.innerText = --num + "";
                }, 1000);
            },
        }
        collisionChecker.addObject(props);
    }

    function showGameMenu() {
        gameMenuShown = true;
        game.pauseGame();
        gameMenu.style.display = "flex";
    }

    function hideGameMenu() {
        gameMenuShown = false;
        game.resumeGame();
        gameMenu.style.display = "none";
    }

    export function getScoreTableRow(score: Score, rank: number, scoreDataHTML: string): HTMLElement {
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
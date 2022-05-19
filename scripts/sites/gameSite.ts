import {bee, collisionChecker, modules, portals} from "../global.js";
import {Utils} from "../utils.js";
import {CollisionChecker} from "../collisionChecker.js";
import {Game} from "../games/game.js";

/** Manages things shared across games (menus etc.). Manages switches between menu - game - game menu - end menu */
export module GameSite {
    type Score = {
        name: string;
        timestamp: number;
    }

    let DOMelements: {
        counter: HTMLElement;
        game: HTMLDivElement;
        menu: HTMLElement;
        playButt: HTMLElement;
        endScreen: {
            screen: HTMLElement,
            gameData: HTMLElement,
            restartButt: HTMLElement,
            mainMenuButt: HTMLElement,
            buttons: HTMLElement,
        };
        gameMenu: {
            menu: HTMLElement;
            resumeButt: HTMLElement;
            leaveButt: HTMLElement;
        }
        scoreTable: {
            onlineButt: HTMLElement;
            localButt: HTMLElement;
        }
    };

    enum Screen { MENU, GAME, GAME_MENU, END_SCREEN }

    let currentScreen: Screen = Screen.MENU;
    let gameInstance: Game;
    let getGameFunc: (endCallback: (endScreenData: HTMLElement) => void) => Game;
    modules.push(run);

    function run() {
        DOMelements = {
            counter: document.getElementById("counter") as HTMLElement,
            game: document.getElementById("game") as HTMLDivElement,
            menu: document.getElementById("menu") as HTMLElement,
            endScreen: {
                screen: document.getElementById("end-screen") as HTMLElement,
                gameData: document.getElementById("end-screen-game-data") as HTMLElement,
                restartButt: document.getElementById("restart-butt") as HTMLElement,
                mainMenuButt: document.getElementById("main-menu-butt") as HTMLElement,
                buttons: document.getElementById("end-screen-buttons") as HTMLElement,
            },
            playButt: document.getElementById("play-button") as HTMLElement,
            gameMenu: {
                menu: document.getElementById("game-menu") as HTMLElement,
                resumeButt: document.getElementById("resume-button") as HTMLElement,
                leaveButt: document.getElementById("leave-button") as HTMLElement,
            },
            scoreTable: {
                onlineButt: document.getElementById("score-table-online-butt") as HTMLElement,
                localButt: document.getElementById("score-table-local-butt") as HTMLElement,
            }
        }
        
        initializeMainMenu();

        document.addEventListener("visibilitychange", function() {
            if (document.visibilityState === 'hidden' && gameInstance?.running)
                pauseGame();
        });

        document.addEventListener("keydown", (e) => {
            if (gameInstance?.running && e.key === "Escape" && !e.repeat)
                currentScreen === Screen.GAME_MENU ? resumeGame() : pauseGame();
        });

        DOMelements.gameMenu.resumeButt.addEventListener("click", () => resumeGame());
        DOMelements.gameMenu.leaveButt.addEventListener("click", () => leaveGame());
    }

    function changeScreen(screen: Screen) {
        if (screen === currentScreen)
            return;

        // Make the screen visible.
        switch (screen) {
            case Screen.MENU:
                DOMelements.menu.style.animation = "fade-in 1s forwards";
                portals.setSidePortalsDisplay(true);
                break;
            case Screen.GAME:
                DOMelements.game.style.display = "initial";
                break;
            case Screen.GAME_MENU:
                DOMelements.gameMenu.menu.style.display = "flex";
                DOMelements.gameMenu.menu.style.animation = "var(--game-menu-fadein-animation)";
                bee.pauseUpdates = true;
                break;
            case Screen.END_SCREEN:
                DOMelements.endScreen.screen.style.display = "initial";
                DOMelements.endScreen.screen.style.animation = "fade-in 1s forwards";
                setTimeout(() => activateEndScreenButtons(), 2000);
                break;
        }

        // Hide the current screen.
        switch (currentScreen) {
            case Screen.MENU:
                DOMelements.menu.style.animation = "var(--menu-fade-out-animation)";
                portals.setSidePortalsDisplay(false);
                break;
            case Screen.GAME:
                if (screen == Screen.GAME_MENU)
                    break;

                DOMelements.game.style.display = "none";
                break;
            case Screen.GAME_MENU:
                if (screen != Screen.GAME)
                    DOMelements.game.style.display = "none";

                DOMelements.gameMenu.menu.style.display = "none";
                bee.pauseUpdates = false;
                break;
            case Screen.END_SCREEN:
                DOMelements.endScreen.screen.style.display = "none";
                deactivateEndScreenButtons();
                break;
        }

        currentScreen = screen;
    }

    /** A global function so that the Game can add itself to the site's game script. */
    export function addGame(getGameFunction: (endCallback: (endScreenData: HTMLElement) => void) => Game) {
        if (gameInstance)
            throw new Error("Game is already assigned.");
        getGameFunc = getGameFunction;
        gameInstance = getGameFunc((endScreenData: HTMLElement) => onGameFinished(endScreenData));

        modules.push(() => assignToBee());

        const assignToBee = () => {
            // Assign game-specific bee properties to the bee.
            for (const key in gameInstance.beeProps) {
                if ((bee.props as any)[key].value == null) {
                    console.warn("Bee property '" + key + "', defined in gameInstance, doesnt exist on the bee.");
                    continue;
                }
                (bee.props as any)[key].value = gameInstance.beeProps[key];
            }
        }
    }

    function startGame() {
        gameInstance = getGameFunc((endScreenData: HTMLElement) => onGameFinished(endScreenData));
        changeScreen(Screen.GAME);
        startCounter();
    }

    function leaveGame() {
        gameInstance.stopGame();
        changeScreen(Screen.MENU);
    }

    function resumeGame() {
        changeScreen(Screen.GAME);
        gameInstance.resumeGame();
    }

    function pauseGame() {
        changeScreen(Screen.GAME_MENU);
        gameInstance.pauseGame();
    }

    function onGameFinished(endScreenData: HTMLElement) {
        changeScreen(Screen.END_SCREEN);
        DOMelements.endScreen.gameData.innerHTML = "";
        DOMelements.endScreen.gameData.appendChild(endScreenData);
    }

    /**  Starts a counter (3-2-1) and starts the game. */
    function startCounter() {
        DOMelements.counter.style.display = "block";
        let num = 3;
        DOMelements.counter.innerText = num + "";
        const id = setInterval(() => {
            if (num === 1) {
                clearInterval(id);
                DOMelements.counter.style.display = "none";
                gameInstance.startGame();
            }
            DOMelements.counter.innerText = --num + "";
        }, 1000);
    }

    function activateEndScreenButtons() {
        collisionChecker.add({
            element: DOMelements.endScreen.mainMenuButt,
            onCollisionEnter: () => leaveGame()
        });

        collisionChecker.add({
            element: DOMelements.endScreen.restartButt,
            onCollisionEnter: () => startGame()
        });
    }

    function deactivateEndScreenButtons() {
        collisionChecker.remove(DOMelements.endScreen.mainMenuButt);
        collisionChecker.remove(DOMelements.endScreen.restartButt);
    }

    /** Sets up event handlers for events of elements in the menu. */
    function initializeMainMenu() {
        // Set up score table's "Online" and "Local" buttons.
        DOMelements.scoreTable.onlineButt.addEventListener("mousedown", () => {
            DOMelements.scoreTable.localButt.classList.remove("on");
            DOMelements.scoreTable.onlineButt.classList.add("on");
        });
        DOMelements.scoreTable.localButt.addEventListener("mousedown", () => {
            DOMelements.scoreTable.onlineButt.classList.remove("on");
            DOMelements.scoreTable.localButt.classList.add("on");
        });

        // Set up play button.
        let pressed: boolean = false;
        const props: CollisionChecker.CollidingObject = {
            element: DOMelements.playButt,
            onCollisionEnter: () => {
                if (pressed || window.getComputedStyle(DOMelements.menu).getPropertyValue("opacity") === "0")
                    return;

                pressed = true;
                startGame();
                setTimeout(() => pressed = false, 3000);
            },
        }
        collisionChecker.add(props);
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
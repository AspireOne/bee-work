import { bee, collisionChecker, modules, onUserLoaded, portals, user } from "../global.js";
import { Utils } from "../utils/utils.js";
import { Database } from "../database/database.js";
/** Manages things shared across games (menus etc.). Manages switches between menu - game - game menu - end menu */
export var GameSite;
(function (GameSite) {
    let DOMelements;
    let Screen;
    (function (Screen) {
        Screen[Screen["MENU"] = 0] = "MENU";
        Screen[Screen["GAME"] = 1] = "GAME";
        Screen[Screen["GAME_MENU"] = 2] = "GAME_MENU";
        Screen[Screen["END_SCREEN"] = 3] = "END_SCREEN";
    })(Screen || (Screen = {}));
    let currentScreen = Screen.MENU;
    let scores = [];
    let gameInstance;
    let getGameFunc;
    modules.push(run);
    function run() {
        Database.request("get-scores", { game: gameInstance.gameName })
            .then(dbScores => {
            scores = dbScores;
            onUserLoaded(() => setBest());
            updateScoreTable();
        })
            .catch(error => {
            console.error(error);
        });
        DOMelements = {
            counter: document.getElementById("counter"),
            game: document.getElementById("game"),
            menu: document.getElementById("menu"),
            bestPlay: document.getElementById("best-play"),
            endScreen: {
                screen: document.getElementById("end-screen"),
                gameData: document.getElementById("end-screen-game-data"),
                restartButt: document.getElementById("restart-butt"),
                mainMenuButt: document.getElementById("main-menu-butt"),
                buttons: document.getElementById("end-screen-buttons"),
            },
            playButt: document.getElementById("play-button"),
            gameMenu: {
                menu: document.getElementById("game-menu"),
                resumeButt: document.getElementById("resume-button"),
                leaveButt: document.getElementById("leave-button"),
            },
            scoreTable: {
                onlineButt: document.getElementById("score-table-online-butt"),
                localButt: document.getElementById("score-table-local-butt"),
                rows: document.getElementById("score-table-rows"),
            }
        };
        initializeMainMenu();
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === 'hidden' && (gameInstance === null || gameInstance === void 0 ? void 0 : gameInstance.running))
                pauseGame();
        });
        document.addEventListener("keydown", (e) => {
            if ((gameInstance === null || gameInstance === void 0 ? void 0 : gameInstance.running) && e.key === "Escape" && !e.repeat)
                currentScreen === Screen.GAME_MENU ? resumeGame() : pauseGame();
        });
        DOMelements.gameMenu.resumeButt.addEventListener("click", () => resumeGame());
        DOMelements.gameMenu.leaveButt.addEventListener("click", () => leaveGame());
    }
    function addNewScore(score) {
        Database.request("add-score", score);
        /*.then(score => console.log(score))
        .catch(error => console.log(error));*/
        let best = null;
        for (let i = 0; i < scores.length; ++i) {
            if (scores[i].user._id != (user === null || user === void 0 ? void 0 : user._id))
                continue;
            best = scores[i];
            if (score.time > scores[i].time) {
                scores.splice(i, 1);
                scores.push(score);
                best = score;
            }
            break;
        }
        if (!best)
            scores.push(score);
        console.log(scores);
        updateScoreTable();
        setBest();
    }
    function setBest() {
        var _a;
        const best = (_a = scores.find(score => score.user._id == (user === null || user === void 0 ? void 0 : user._id))) === null || _a === void 0 ? void 0 : _a.time;
        if (best)
            document.getElementById("best-play").innerText = (best / 1000).toFixed(1) + "s";
    }
    function changeScreen(screen) {
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
                window.setTimeout(() => activateEndScreenButtons(), 2000);
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
    function addGame(getGameFunction) {
        if (gameInstance)
            throw new Error("Game is already assigned.");
        getGameFunc = getGameFunction;
        gameInstance = getGameFunc((endScreenData) => onGameFinished(endScreenData));
        modules.push(() => assignToBee());
        const assignToBee = () => {
            // Assign game-specific bee properties to the bee.
            for (const key in gameInstance.beeProps) {
                if (bee.props[key].value == null) {
                    console.warn("Bee property '" + key + "', defined in gameInstance, doesnt exist on the bee.");
                    continue;
                }
                bee.props[key].value = gameInstance.beeProps[key];
            }
        };
    }
    GameSite.addGame = addGame;
    function startGame() {
        gameInstance = getGameFunc((endScreenData) => onGameFinished(endScreenData));
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
    function onGameFinished(endScreenData) {
        const score = {
            user: user,
            game: gameInstance.gameName,
            time: Math.round(gameInstance.totalPassed * 100) / 100,
            time_achieved_unix: Date.now()
        };
        addNewScore(score);
        changeScreen(Screen.END_SCREEN);
        DOMelements.endScreen.gameData.innerHTML = "";
        DOMelements.endScreen.gameData.appendChild(endScreenData);
    }
    /**  Starts a counter (3-2-1) and starts the game. */
    function startCounter() {
        DOMelements.counter.style.display = "block";
        let num = 3;
        DOMelements.counter.innerText = num + "";
        const id = window.setInterval(() => {
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
        /*        DOMelements.scoreTable.onlineButt.addEventListener("mousedown", () => {
                    DOMelements.scoreTable.localButt.classList.remove("on");
                    DOMelements.scoreTable.onlineButt.classList.add("on");
                });*/
        /*DOMelements.scoreTable.localButt.addEventListener("mousedown", () => {
            DOMelements.scoreTable.onlineButt.classList.remove("on");
            DOMelements.scoreTable.localButt.classList.add("on");
        });*/
        // Set up play button.
        let pressed = false;
        const props = {
            element: DOMelements.playButt,
            onCollisionEnter: () => {
                if (pressed || window.getComputedStyle(DOMelements.menu).getPropertyValue("opacity") === "0")
                    return;
                pressed = true;
                startGame();
                window.setTimeout(() => pressed = false, 3000);
            },
        };
        collisionChecker.add(props);
    }
    function updateScoreTable() {
        DOMelements.scoreTable.rows.innerHTML = "";
        scores.sort((a, b) => b.time - a.time).forEach((score, i) => {
            const user = score.user;
            const prettyScore = {
                name: user.username,
                timestamp: score.time_achieved_unix,
                rank: i + 1,
                time: score.time
            };
            DOMelements.scoreTable.rows.appendChild(getScoreTableRow(prettyScore));
        });
    }
    function getScoreTableRow(score) {
        const datetime = new Date(score.timestamp);
        const datetimeString = `${datetime.getDate()}.${datetime.getMonth() + 1}.${datetime.getFullYear()} ${datetime.getHours()}:${datetime.getMinutes()}`;
        const html = `
    <div class="score-table-row">
        <div class="side-by-side">
            <p class="score-rank${score.rank === 1 ? " first" : ""}">#${score.rank}</p>
            <div>
                <p class="score-name">${score.name}</p>
                <p class="score-date">${datetimeString}</p>
            </div>
            <div class="score-data">
                time: ${(score.time / 1000).toFixed(1)}s
            </div>
        </div>
    </div>
        `;
        return Utils.htmlToElement(html);
    }
    GameSite.getScoreTableRow = getScoreTableRow;
})(GameSite || (GameSite = {}));
//# sourceMappingURL=gameSite.js.map
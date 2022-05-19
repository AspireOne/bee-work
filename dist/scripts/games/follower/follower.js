import { Game } from "../game.js";
import { GameSite } from "../../sites/gameSite";
class Follower extends Game {
    Follower(onGameEnded) {
        super(Follower.beeProps, onGameEnded());
    }
    pauseGame() {
    }
    resumeGame() {
    }
    startGame() {
    }
    stopGame() {
    }
}
Follower.beeProps = {
    maxSpeed: 11,
    acceleration: 70
};
GameSite.addGame((endCallback) => new Follower(endCallback));
//# sourceMappingURL=follower.js.map
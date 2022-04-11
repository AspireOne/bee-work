import { Game } from "../game.js";
class Avoider {
    constructor() {
        this._running = false;
        this._paused = false;
        this.id = 0;
    }
    get running() { return this._running; }
    set running(value) { this._running = value; }
    get paused() { return this._paused; }
    set paused(value) { this._paused = value; }
    startGame() {
        if (this.running) {
            throw new Error("Game was attempted to be started but is already running.");
            return;
        }
        this.running = true;
        this.id = setInterval(() => {
            if (this.paused)
                return;
            this.update();
        }, Avoider.delta);
    }
    update() {
        console.log("updoot");
    }
    stopGame() {
        this.running = false;
        this.paused = false;
        clearInterval(this.id);
        this.id = 0;
    }
    pauseGame() {
        this.paused = true;
    }
    resumeGame() {
        this.paused = false;
    }
}
Avoider.delta = 16;
Game.addGame(new Avoider());
//# sourceMappingURL=avoider.js.map
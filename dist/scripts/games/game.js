import { Utils } from "../utils.js";
export class Game {
    constructor(onGameEnded) {
        this.onGameEnded = onGameEnded;
        this.DOMElements = {
            achivement: document.getElementById("achivement"),
            achivementName: document.getElementById("achivement-name"),
            achivementDescription: document.getElementById("achivement-description"),
        };
    }
    showAchivement(achivement) {
        achivement.passed = true;
        Utils.resetAnimation(this.DOMElements.achivement);
        this.DOMElements.achivementName.innerText = achivement.name;
        this.DOMElements.achivementDescription.innerText = achivement.description;
        this.DOMElements.achivement.style.animation = "var(--achivement-animation)";
    }
}
//# sourceMappingURL=game.js.map
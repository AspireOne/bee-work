import { collisionChecker } from "../../global.js";
import { Utils } from "../../utils.js";
var htmlToElement = Utils.htmlToElement;
var randomIntFromInterval = Utils.randomIntFromInterval;
var Side;
(function (Side) {
    Side[Side["LEFT"] = 0] = "LEFT";
    Side[Side["RIGHT"] = 1] = "RIGHT";
    Side[Side["TOP"] = 2] = "TOP";
    Side[Side["BOTTOM"] = 3] = "BOTTOM";
    Side[Side["NONE"] = 4] = "NONE";
})(Side || (Side = {}));
;
export class RandomBallGenerator {
    constructor(div) {
        this.ballProps = {
            speed: 2,
            width: 80
        };
        this.balls = [];
        this.ballGenerationTimer = 0;
        this.div = div;
    }
    update(delta) {
        this.ballGenerationTimer += delta;
        this.balls.forEach(ball => {
            this.getNewPos(ball);
            ball.element.style.left = ball.currPos.x + "px";
            ball.element.style.top = ball.currPos.y + "px";
            if (ball.currPos.y < -this.ballProps.width - 10 || ball.currPos.y > document.body.clientHeight || ball.currPos.x < -this.ballProps.width - 10 || ball.currPos.x > document.body.clientWidth) {
                this.removeBall(ball);
            }
        });
        if (this.ballGenerationTimer >= RandomBallGenerator.generationFrequency) {
            this.ballGenerationTimer = 0;
            this.addNewBall();
        }
    }
    addNewBall() {
        const ball = this.generateBall();
        this.div.appendChild(ball.element);
        collisionChecker.addObject({ element: ball.element });
        this.balls.push(ball);
    }
    removeBall(ball, notFromArray = false) {
        ball.element.remove();
        collisionChecker.Remove(ball.element);
        if (!notFromArray)
            this.balls.splice(this.balls.indexOf(ball), 1);
    }
    finish() {
        this.balls.forEach(ball => this.removeBall(ball, true));
    }
    getRandomStartingPos(degrees) {
        let side;
        // Pick a side randomly based on degrees (trajectory).
        side = this.getRandomSide(degrees);
        if (side === Side.NONE)
            side = this.getSpecialCaseSide(degrees);
        if (side === Side.NONE)
            throw new Error("Could not find a starting side for " + degrees + " degrees.");
        return this.getRandomPoint(side);
    }
    // Special cases where the angle is so close to full 90deg that starting from any other side than parallel is not desirable.
    getSpecialCaseSide(degrees) {
        const offset = RandomBallGenerator.angleOffset;
        if (degrees >= 360 - offset || degrees <= offset)
            return Side.BOTTOM;
        else if (degrees >= 90 - offset && degrees <= 90 + offset)
            return Side.RIGHT;
        else if (degrees >= 180 - offset && degrees <= 180 + offset)
            return Side.TOP;
        else if (degrees >= 270 - offset && degrees <= 270 + offset)
            return Side.LEFT;
        else
            return Side.NONE;
    }
    getRandomSide(degrees) {
        let possibleSides = { one: Side.NONE, two: Side.NONE };
        const offset = RandomBallGenerator.angleOffset;
        if (degrees > offset && degrees < 90 - offset) // Left, bottom
            possibleSides = { one: Side.LEFT, two: Side.BOTTOM };
        else if (degrees > 90 + offset && degrees < 180 - offset) // Left, top
            possibleSides = { one: Side.LEFT, two: Side.TOP };
        else if (degrees > 180 + offset && degrees < 270 - offset) // Right, top
            possibleSides = { one: Side.RIGHT, two: Side.TOP };
        else if (degrees > 270 + offset && degrees < 360 - offset) // Right, bottom
            possibleSides = { one: Side.RIGHT, two: Side.BOTTOM };
        return randomIntFromInterval(0, 2) ? possibleSides.one : possibleSides.two;
    }
    getRandomPoint(side) {
        const point = { x: 0, y: 0 };
        switch (side) {
            case Side.TOP:
                point.y = -this.ballProps.width;
                point.x = Math.random() * document.body.clientWidth;
                break;
            case Side.RIGHT:
                point.x = document.body.clientWidth;
                point.y = Math.random() * document.body.clientHeight;
                break;
            case Side.BOTTOM:
                point.y = document.body.clientHeight;
                point.x = Math.random() * document.body.clientWidth;
                break;
            case Side.LEFT:
                point.x = -this.ballProps.width;
                point.y = Math.random() * document.body.clientHeight;
                break;
        }
        return point;
    }
    generateBall() {
        const degrees = Math.floor(Math.random() * 360);
        const startingPos = this.getRandomStartingPos(degrees);
        const ballElement = this.createBallElement(startingPos);
        return { degrees: degrees, currPos: startingPos, element: ballElement };
    }
    createBallElement(pos) {
        const ball = htmlToElement(`<img src="../../../resources/circle.png">`);
        ball.style.position = "absolute";
        ball.style.width = this.ballProps.width + "px";
        ball.style.height = this.ballProps.width + "px";
        ball.style.left = pos.x + "px";
        ball.style.top = pos.y + "px";
        return ball;
    }
    getNewPos(ball) {
        const degrees = ball.degrees - 90;
        let rad = degrees * Math.PI / 180;
        ball.currPos.x = ball.currPos.x + Math.cos(rad) * this.ballProps.speed;
        ball.currPos.y = ball.currPos.y + Math.sin(rad) * this.ballProps.speed;
    }
}
RandomBallGenerator.generationFrequency = 200;
RandomBallGenerator.angleOffset = 10;
//# sourceMappingURL=randomBallGenerator.js.map
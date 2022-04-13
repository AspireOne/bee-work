export declare class RandomBallGenerator {
    ballProps: {
        speed: number;
        width: number;
    };
    private readonly div;
    static generationFrequency: number;
    private static readonly angleOffset;
    private readonly balls;
    private ballGenerationTimer;
    constructor(div: HTMLElement);
    update(delta: number): void;
    private addNewBall;
    private removeBall;
    finish(): void;
    private getRandomStartingPos;
    private getSpecialCaseSide;
    private getRandomSide;
    private getRandomPoint;
    private generateBall;
    private createBallElement;
    private getNewPos;
}

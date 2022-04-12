export declare class RandomBallGenerator {
    ballProps: {
        speed: number;
        width: number;
        generationFrequency: number;
    };
    private static readonly angleOffset;
    private readonly balls;
    private ballGenerationTimer;
    update(delta: number): void;
    private getRandomStartingPos;
    private getSpecialCaseSide;
    private getRandomSide;
    private getRandomPoint;
    private generateBall;
    private createBallElement;
    private getNewPos;
}

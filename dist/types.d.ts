export declare module Types {
    type Point = {
        x: number;
        y: number;
    };
    type Range = {
        min: number;
        max: number;
    };
    type ModifiableProp = {
        value: number;
        values: {
            readonly default: number;
            readonly min: number;
            readonly max: number;
        };
    };
    type SavedModifiableProp = {
        [p: string]: number;
    };
    type SaveableProps = {
        saveName: string;
    };
}

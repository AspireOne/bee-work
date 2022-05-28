/** Contains globally usable types. */
export module Types {
    export type KeysMatching<T, V> = {[K in keyof T]-?: T[K] extends V ? K : never}[keyof T];
    export type Point = { x: number; y: number };
    export type Range = { min: number, max: number };
    export type SavedModifiableProp = { [p: string]: number; }
    export type ModifiableProp = {
        value: number;
        values: {
            readonly default: number;
            readonly min: number;
            readonly max: number;
        },
    }
    export enum WayX { LEFT, RIGHT, NONE }
    export enum WayY { UP, DOWN, NONE }
}
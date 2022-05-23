export declare module Database {
    interface ISchema {
        readonly dbName: string;
    }
    export const userSchema: any;
    export function save(schema: ISchema): Promise<any>;
    export {};
}

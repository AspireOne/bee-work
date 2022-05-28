export declare module Database {
    type Error = {
        code: number;
        message: string;
    };
    function getError(code: number): Error;
    function post(endpoint: string, data: object): Promise<{
        body: any;
        status: number;
    }>;
}

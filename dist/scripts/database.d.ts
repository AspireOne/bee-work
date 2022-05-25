export declare module Database {
    const errorType: {
        specific: string;
        global: string;
    };
    type Error = {
        code: number;
        message: string;
    };
    type GlobalError = Error & {
        type: "global";
    };
    const globalErrors: {
        noGet: {
            code: number;
            message: string;
            type: string;
        };
        noPost: {
            code: number;
            message: string;
            type: string;
        };
    };
    function getErrorOrNull(error: {
        code: number;
        type: string;
    }, specificErrorsArray: {
        [key: string]: Error;
    }): Error | null;
    const isGlobalError: (obj: object) => boolean;
    function post(endpoint: string, data: object): Promise<object>;
}

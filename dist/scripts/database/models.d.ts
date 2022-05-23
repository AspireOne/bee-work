import { Types } from "../types.js";
export declare module Models {
    module User {
        import SavedModifiableProp = Types.SavedModifiableProp;
        interface IUser {
            username: string;
            password: string;
            email: string;
            bee_props?: {
                [key: string]: SavedModifiableProp;
            };
            circle_props?: {
                [key: string]: SavedModifiableProp;
            };
        }
        const User: any;
    }
}

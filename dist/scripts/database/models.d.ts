import mongoose from "mongoose";
import { Types } from "../types.js";
export declare module Models {
    module User {
        import SavedModifiableProp = Types.SavedModifiableProp;
        interface Interface {
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
        const Schema: mongoose.Schema<Interface, mongoose.Model<Interface, any, any, any>, {}, {}>;
        const Model: mongoose.Model<Interface, {}, {}, {}>;
    }
}

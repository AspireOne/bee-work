import mongoose from "mongoose";
import {Types} from "../utils/types.js";

// Note: when defining arrays, type has to be defined. Example:
// @prop({ type: () => Job })
// public jobs?: Job[]; // This is a SubDocument Array


/*class User {
    @prop({required: true})
    public username!: string;
    @prop({required: true})
    public password!: string;
    @prop({required: true})
    public email!: string;
}
export const UserModel = getModelForClass(User);
let document = await UserModel.create({ name: 'Kitty' });*/

export module Models {
    export module User {
        import ModifiableProp = Types.ModifiableProp;
        import SavedModifiableProp = Types.SavedModifiableProp;

        export interface Interface {
            username?: string;
            password?: string;
            hashed_password?: string;
            email?: string;
            bee_props?: Types.SavedModifiableProp;
            circle_props?: Types.SavedModifiableProp;
            _id?: string;
        }

        // 2. Create a Schema corresponding to the document interface.
        export const Schema = new mongoose.Schema<Interface>({
            username: {type: String, required: true, unique: true},
            email: {type: String, required: true, unique: true},
            hashed_password: {type: String, required: true, unique: false},
            bee_props: {type: Object, required: false, unique: false},
            circle_props: {type: Object, required: false, unique: false},
        });

        // 3. Create a Model.
        export const Model = mongoose.model<Interface>('User', Schema);
    }
}
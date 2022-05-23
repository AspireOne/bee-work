import mongoose from "mongoose";
import {Types} from "../types.js";

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

        export interface IUser {
            username: string;
            password: string;
            email: string;
            bee_props?: {[key: string]: SavedModifiableProp};
            circle_props?: {[key: string]: SavedModifiableProp};
        }

        // 2. Create a Schema corresponding to the document interface.
        const userSchema = new mongoose.Schema<IUser>({
            username: {type: String, required: true, unique: true},
            email: {type: String, required: true, unique: true},
            password: {type: String, required: true, unique: false},
            bee_props: {type: Object, required: false, unique: false},
            circle_props: {type: Object, required: false, unique: false},
        });

        // 3. Create a Model.
        export const User = mongoose.model<IUser>('User', userSchema);

        /*const user = new User({
            name: 'Bill',
            email: 'bill@initech.com',
            avatar: 'https://i.imgur.com/dM7Thhn.png'
        });*/
    }
}
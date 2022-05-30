import mongoose from "mongoose";
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
export var Models;
(function (Models) {
    let User;
    (function (User) {
        // 2. Create a Schema corresponding to the document interface.
        User.Schema = new mongoose.Schema({
            username: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            hashed_password: { type: String, required: true, unique: false },
            bee_props: { type: Object, required: false, unique: false },
            circle_props: { type: Object, required: false, unique: false },
            scores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Score" }]
        });
        // 3. Create a Model.
        //export const Model = mongoose.model<Interface>('User', Schema);
    })(User = Models.User || (Models.User = {}));
    let Score;
    (function (Score) {
        Score.Schema = new mongoose.Schema({
            time: { type: String, required: true, unique: false },
            time_achieved_unix: { type: Number, required: true, unique: false },
            game: { type: String, required: true, unique: false },
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        });
    })(Score = Models.Score || (Models.Score = {}));
})(Models || (Models = {}));
//# sourceMappingURL=models.js.map
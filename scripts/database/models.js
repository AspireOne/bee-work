"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Models = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
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
var Models;
(function (Models) {
    var User;
    (function (User_1) {
        // 2. Create a Schema corresponding to the document interface.
        var userSchema = new mongoose_1["default"].Schema({
            username: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true, unique: false },
            bee_props: { type: Object, required: false, unique: false },
            circle_props: { type: Object, required: false, unique: false }
        });
        // 3. Create a Model.
        User_1.User = mongoose_1["default"].model('User', userSchema);
        /*const user = new User({
            name: 'Bill',
            email: 'bill@initech.com',
            avatar: 'https://i.imgur.com/dM7Thhn.png'
        });*/
    })(User = Models.User || (Models.User = {}));
})(Models = exports.Models || (exports.Models = {}));

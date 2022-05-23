var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from 'mongodb';
const mongodbPassword = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://Aspire:${mongodbPassword}@cluster0.2j2lg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "GET Not allowed" };
    }
    const user = JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}");
    let error = null;
    error = checkRequiredAndReturnError(user);
    if (error !== null)
        return { statusCode: 400, body: error };
    yield client.connect();
    const database = client.db("bee-work");
    const users = database.collection("users");
    const usernameExists = yield users.findOne({ username: user.username });
    const emailExists = yield users.findOne({ email: user });
    if (usernameExists !== null)
        error = "Username already exists";
    if (emailExists !== null)
        error = "Email already exists";
    if (error !== null)
        return { statusCode: 400, body: error };
    /*const model = new Models.User.User(user);
    mongoose.connect();*/
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World" }),
    };
    yield client.close();
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World", movie: null })
    };
});
function checkRequiredAndReturnError(user) {
    if (user.username == null)
        return "Username is missing";
    else if (user.password == null)
        return "Password is missing";
    else if (user.email == null)
        return "Email is missing";
    return null;
}
export { handler };
//# sourceMappingURL=register-user.js.map
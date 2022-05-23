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
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "DO NOT USE THIS", event: event, context: context }),
    };
    const movie = yield findMovie();
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World", movie: movie }),
    };
});
function findMovie() {
    return __awaiter(this, void 0, void 0, function* () {
        let movie = null;
        const client = new MongoClient(uri);
        try {
            yield client.connect();
            const database = client.db("sample_mflix");
            const movies = database.collection("movies");
            const query = { title: "The Room" };
            movie = yield movies.findOne(query);
            // since this method returns the matched document, not a cursor, print it directly
        }
        finally {
            yield client.close();
        }
        return movie;
    });
}
export { handler };
//# sourceMappingURL=save-to-database.js.map
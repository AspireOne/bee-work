import { Handler } from "@netlify/functions";
import {FindOptions, MongoClient, ServerApiVersion, WithId} from 'mongodb';

const mongodbPassword = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://Aspire:${mongodbPassword}@cluster0.2j2lg.mongodb.net/?retryWrites=true&w=majority`;
const handler: Handler = async (event, context) => {
    const movie = await findMovie();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World", movie: movie }),
    };
};

async function findMovie() {
    let movie = null;
    setTimeout
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db("sample_mflix");
        const movies = database.collection("movies");
        const query = { title: "The Room" };
        movie = await movies.findOne(query);
        // since this method returns the matched document, not a cursor, print it directly
    } finally {
        await client.close();
    }
    return movie;
}

export { handler };
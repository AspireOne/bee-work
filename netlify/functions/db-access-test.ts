import { Handler } from "@netlify/functions";
import {MongoClient, ServerApiVersion} from 'mongodb';

const handler: Handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World" }),
    };
};

const uri = "mongodb+srv://Aspire:<password>@cluster0.2j2lg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});

export { handler };
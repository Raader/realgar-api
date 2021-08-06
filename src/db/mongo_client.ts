import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("mongodb environment variables missing");

const mongoClient = new MongoClient(uri);

export default mongoClient;

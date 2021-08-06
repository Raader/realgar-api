import mongoClient from "./mongo_client";
import MongoDatabase from "./mongo_database";

const mongoDatabase = new MongoDatabase(mongoClient);
export default mongoDatabase;

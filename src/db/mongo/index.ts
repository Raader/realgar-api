import mongoClient from "./mongo_client";
import MongoCollection from "./mongo_collection";
import MongoDatabase from "./mongo_database";

const mongoDatabase = new MongoDatabase(mongoClient);

export default function createMongoCollection<Type>(
  name: string
): MongoCollection<Type> {
  return new MongoCollection<Type>(mongoDatabase, name);
}

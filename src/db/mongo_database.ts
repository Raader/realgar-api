import { Collection, Db, MongoClient } from "mongodb";
import mongoClient from "./mongo_client";

export class MongoDatabase {
  private db: Promise<Db>;

  constructor(client: MongoClient) {
    this.db = client.connect().then((cl) => {
      console.log("connected to the database");
      return cl.db();
    });
  }

  async collection<Type>(name: string): Promise<Collection<Type>> {
    return (await this.db).collection<Type>(name);
  }
}

const mongoDatabase = new MongoDatabase(mongoClient);
export default mongoDatabase;

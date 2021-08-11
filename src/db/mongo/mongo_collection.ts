import { Collection, OptionalId } from "mongodb";
import DatabaseCollection from "../database_collection";
import MongoDatabase from "./mongo_database";

export default class MongoCollection<Type> implements DatabaseCollection<Type> {
  collection: Promise<Collection<Type>>;

  constructor(database: MongoDatabase, name: string) {
    this.collection = database.collection<Type>(name);
  }

  async find(
    filter: Partial<Type>,
    opts = { limit: 10, skip: 0 }
  ): Promise<Type[]> {
    const collection = await this.collection;
    const cursor = collection.find(filter).skip(opts.skip).limit(opts.limit);

    if ((await cursor.count()) === 0) {
      return [];
    }

    const documents: Type[] = [];
    await cursor.forEach((doc) => {
      documents.push(doc);
    });

    return documents;
  }

  async findOne(filter: Partial<Type>): Promise<Type | undefined> {
    const collection = await this.collection;
    const document = await collection.findOne(filter);
    return document;
  }

  async insertOne(document: Type): Promise<Type | undefined> {
    const collection = await this.collection;
    const result = await collection.insertOne(document as OptionalId<Type>);
    if (result.insertedId) {
      return document;
    }
  }

  async updateOne(
    filter: Partial<Type>,
    update: Partial<Type>
  ): Promise<Type | undefined> {
    const collection = await this.collection;
    const updateDoc = { $set: update };
    const result = await collection.findOneAndUpdate(filter, updateDoc, {
      returnDocument: "after",
    });
    if (result.ok) return result.value;
  }

  async deleteOne(filter: Partial<Type>): Promise<void> {
    const collection = await this.collection;
    await collection.deleteOne(filter);
  }

  async deleteMany(filter: Partial<Type>): Promise<void> {
    const collection = await this.collection;
    await collection.deleteMany(filter);
  }
}

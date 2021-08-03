import DataModel from "./data.model";
import DatabaseCollection from "./database_collection";
import Validator from "../validation/validator";
import ValidationSchema from "../validation/validation_schema";
import { nanoid } from "nanoid";

export default class DatabaseModel<Type> implements DataModel<Type> {
  collection: DatabaseCollection<Type>;
  validator: Validator<Type>;

  constructor(
    collection: DatabaseCollection<Type>,
    schema: ValidationSchema<Type>
  ) {
    this.collection = collection;
    this.validator = new Validator(schema);
  }

  async create(document: Type): Promise<Type | undefined> {
    this.validator.validate(document);
    return await this.collection.insertOne({ ...document, id: nanoid(10) });
  }

  async read(
    filter: Partial<Type>,
    { limit, skip }: { limit?: number; skip?: number } = {}
  ): Promise<Type[]> {
    limit = limit || 10;
    skip = skip || 0;
    const documents = await this.collection.find(filter, {
      limit: limit,
      skip: skip,
    });
    return documents;
  }

  async readOne(filter: Partial<Type>): Promise<Type | undefined> {
    return await this.collection.findOne(filter);
  }

  async updateOne(
    filter: Partial<Type>,
    update: Partial<Type>
  ): Promise<Type | undefined> {
    this.validator.validate(
      update,
      false,
      Object.keys(update) as Array<keyof Type>
    );
    const document = await this.collection.updateOne(filter, update);
    return document;
  }

  async deleteOne(filter: Partial<Type>): Promise<void> {
    await this.collection.deleteOne(filter);
    return;
  }

  async deleteMany(filter: Partial<Type>): Promise<void> {
    await this.collection.deleteMany(filter);
    return;
  }
}

export default interface DatabaseCollection<Type> {
  insertOne: (document: Type) => Promise<Type | undefined>;
  findOne: (filter: Partial<Type>) => Promise<Type | undefined>;
  find: (
    filter: Partial<Type>,
    opts?: { limit: number; skip: number }
  ) => Promise<Type[]>;
  updateOne: (
    filter: Partial<Type>,
    update: Partial<Type>
  ) => Promise<Type | undefined>;
  deleteOne: (filter: Partial<Type>) => Promise<void>;
  deleteMany: (filter: Partial<Type>) => Promise<void>;
}

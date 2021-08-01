export default interface DatabaseCollection<Type> {
  insertOne: (document: Type) => Promise<Type>;
  findOne: (filter: Partial<Type>) => Promise<Type>;
  find: (
    filter: Partial<Type>,
    opts?: { limit?: number; skip?: number }
  ) => Promise<Type[]>;
  updateOne: (filter: Partial<Type>, update: Partial<Type>) => Promise<Type>;
  deleteOne: (filter: Partial<Type>) => Promise<void>;
  deleteMany: (filter: Partial<Type>) => Promise<void>;
}

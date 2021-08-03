export default interface DataModel<Type> {
  create: (resource: Type) => Promise<Type | undefined>;
  readOne: (filter: Partial<Type>) => Promise<Type | undefined>;
  read: (
    filter: Partial<Type>,
    opts?: { limit?: number; skip?: number }
  ) => Promise<Type[]>;
  updateOne: (
    filter: Partial<Type>,
    update: Partial<Type>
  ) => Promise<Type | undefined>;
  deleteOne: (filter: Partial<Type>) => Promise<void>;
  deleteMany: (filter: Partial<Type>) => Promise<void>;
}

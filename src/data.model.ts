export default interface DataModel<Type> {
  readOne: (filter: Partial<Type>) => Promise<Type | undefined>;
  read: (
    filter: Partial<Type>,
    opts: { limit?: number; skip?: number }
  ) => Promise<Type[]>;
  create: (resource: Type) => Promise<Type | undefined>;
}

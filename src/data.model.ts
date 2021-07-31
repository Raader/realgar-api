export default interface DataModel<Type> {
  findOne: (filter: Partial<Type>) => Promise<Type | undefined>;
  create: (resource: Type) => Promise<Type | undefined>;
}

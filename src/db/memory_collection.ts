import lodash from "lodash";
import DataCollection from "./data_collection";

export default class InMemoryDatabaseCollection<Type>
  implements DataCollection<Type>
{
  items: any[];
  constructor() {
    this.items = [];
  }
  async insertOne(document: any): Promise<any> {
    this.items.push(document);
    return document;
  }
  async findOne(filter: any): Promise<any> {
    return lodash.find(this.items, filter);
  }
  async find(filter: any, opts: any): Promise<any[]> {
    return lodash
      .filter(this.items, filter)
      .slice(opts.skip || 0, opts.skip + opts.limit || 10);
  }
  async updateOne(filter: any, update: any): Promise<any> {
    const item = lodash.find(this.items, filter);
    return lodash.merge(item, update);
  }
  async deleteOne(filter: any): Promise<void> {
    const item = lodash.find(this.items, filter);
    lodash.remove(this.items, (val) => val.id === item?.id);
    return;
  }
  async deleteMany(filter: any): Promise<void> {
    const items = lodash.filter(this.items, filter);
    for (const item of items) {
      lodash.remove(this.items, (val) => val.id === item?.id);
    }
    return;
  }
}

import DataCollection from "../db/data_collection";
import DatabaseModel from "../db/database_model";
import User from "./user.interface";
import bcrypt from "bcrypt";

export default class UserModel extends DatabaseModel<User> {
  constructor(collection: DataCollection<User>) {
    super(collection, {
      username: (val) => val && typeof val === "string" && val.length < 20,
      email: (val) => val && typeof val === "string" && val.length < 100,
      password: (val) => {
        if (val)
          return typeof val === "string" && val.length > 8 && val.length < 200;
        return true;
      },
      settings: (val) => {
        if (val) {
          return val.currency
            ? typeof val.currency === "string" && val.currency.length === 3
            : true;
        }
        return true;
      },
    });
  }

  async create(user: User): Promise<User | undefined> {
    if (user.password)
      user = {
        ...user,
        password: await bcrypt.hash(user.password, 10),
      };
    user.settings = {
      ...user.settings,
      currency: user.settings?.currency
        ? user.settings.currency.toUpperCase()
        : "USD",
    };
    return super.create(user);
  }

  async read(filter: Partial<User>): Promise<User[]> {
    const users = await super.read(filter);
    //exclude password from read operations
    for (const user of users) {
      delete user?.password;
    }
    return users;
  }

  async readOne(filter: Partial<User>): Promise<User | undefined> {
    const user = await super.readOne(filter);
    return user;
  }
}

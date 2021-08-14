import DataModel from "../db/data_model";
import User from "./user.interface";

export default class UserService {
  userModel: DataModel<User>;

  constructor(userModel: DataModel<User>) {
    this.userModel = userModel;
  }

  async createUser(user: User): Promise<User | undefined> {
    return this.userModel.create(user);
  }

  async readUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.readOne({ email });
  }

  async readUserById(id: string): Promise<User | undefined> {
    return this.userModel.readOne({ id });
  }
}

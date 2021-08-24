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

  async updateUserById(
    id: string,
    update: Partial<User>
  ): Promise<User | undefined> {
    return this.userModel.updateOne({ id }, update);
  }

  async forEach(
    fn: (document: User) => void,
    filter?: Partial<User>,
    step?: number
  ): Promise<void> {
    return this.userModel.forEach(fn, filter, step);
  }
}

import User from "../user/user.interface";
import UserService from "../user/user_service";
import bcrypt from "bcrypt";

export default class AuthenticationService {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(user: User): Promise<User | undefined> {
    if (!user.password) throw new Error("password is required");
    if (await this.userService.readUserByEmail(user.email))
      throw new Error("user already exists");
    return this.userService.createUser(user);
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | undefined> {
    const user = await this.userService.readUserByEmail(email);
    if (!user) throw new Error("user does not exist");
    if (!user.password)
      throw new Error("user authenticated with a different method");
    if (!(await bcrypt.compare(password, user.password)))
      throw new Error("passwords are not matching");
    return user;
  }
}

import User from "./user.interface";
import UserModel from "./user.model";
import UserService from "./user_service";
import createMongoCollection from "../db/mongo";

const collection = createMongoCollection<User>("users");
const userModel = new UserModel(collection);
const userService = new UserService(userModel);
export default userService;

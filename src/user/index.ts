import InMemoryDatabaseCollection from "../db/memory_collection";
import UserModel from "./user.model";
import UserService from "./user_service";

const userModel = new UserModel(new InMemoryDatabaseCollection());
const userService = new UserService(userModel);
export default userService;

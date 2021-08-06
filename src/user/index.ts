import InMemoryDatabaseCollection from "../db/memory_collection";
import MongoCollection from "../db/mongo_collection";
import mongoDatabase from "../db/mongo_database";
import User from "./user.interface";
import UserModel from "./user.model";
import UserService from "./user_service";

const collection = new MongoCollection<User>(mongoDatabase, "users");
const userModel = new UserModel(collection);
const userService = new UserService(userModel);
export default userService;

import InMemoryDatabaseCollection from "../db/memory_collection";
import UserModel from "./user.model";

const userModel = new UserModel(new InMemoryDatabaseCollection());

export default userModel;

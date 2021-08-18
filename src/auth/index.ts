import userService from "../user";
import AuthenticationService from "./auth_service";

const authenticationService = new AuthenticationService(userService);
export default authenticationService;

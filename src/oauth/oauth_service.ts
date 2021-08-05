import User from "../user/user.interface";
import UserService from "../user/user_service";

type CodeExchangeFn = (code: string) => Promise<string | undefined>;
type FetchUserInfo = (
  token: string
) => Promise<{ username: string; email: string } | undefined>;

export default class OauthService {
  authorizeURL: string;
  private exchangeCode: CodeExchangeFn;
  private fetchUserInfo: FetchUserInfo;
  private userService: UserService;

  constructor(
    exchangeCode: CodeExchangeFn,
    fetchUserInfo: FetchUserInfo,
    userService: UserService,
    authorizeURL = ""
  ) {
    this.exchangeCode = exchangeCode;
    this.fetchUserInfo = fetchUserInfo;
    this.authorizeURL = authorizeURL;
    this.userService = userService;
  }

  async authenticate(code: string): Promise<User | undefined> {
    //get access token and use it to get user info
    const accessToken = await this.exchangeCode(code);
    if (!accessToken) throw new Error("error fetching access token");
    const userInfo = await this.fetchUserInfo(accessToken);
    if (!userInfo) throw new Error("error fetching user info");
    //check if user is already in db
    const user = await this.userService.readUserByEmail(userInfo.email);
    //return user as is if it exists
    if (user) return user;
    //save user to the database
    return this.userService.createUser(userInfo);
  }
}

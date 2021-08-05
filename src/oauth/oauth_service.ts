import DataModel from "../db/data.model";
import User from "../user/user.interface";

type CodeExchangeFn = (code: string) => Promise<string | undefined>;
type FetchUserInfo = (
  token: string
) => Promise<{ username: string; email: string } | undefined>;

export default class OauthService {
  private exchangeCode: CodeExchangeFn;
  private fetchUserInfo: FetchUserInfo;
  private userModel: DataModel<User>;

  constructor(
    exchangeCode: CodeExchangeFn,
    fetchUserInfo: FetchUserInfo,
    userModel: DataModel<User>
  ) {
    this.exchangeCode = exchangeCode;
    this.fetchUserInfo = fetchUserInfo;
    this.userModel = userModel;
  }

  async authenticate(code: string): Promise<User | undefined> {
    //get access token and use it to get user info
    const accessToken = await this.exchangeCode(code);
    if (!accessToken) throw new Error("error fetching access token");
    const userInfo = await this.fetchUserInfo(accessToken);
    if (!userInfo) throw new Error("error fetching user info");
    //check if user is already in db
    const user = await this.userModel.readOne({ email: userInfo.email });
    //return user as is if it exists
    if (user) return user;
    //save user to the database
    return this.userModel.create(userInfo);
  }
}

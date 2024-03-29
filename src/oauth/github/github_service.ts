import OauthService from "../oauth_service";
import axios from "axios";
import UserService from "../../user/user_service";

export default class GithubService extends OauthService {
  constructor(
    clientId: string,
    clientSecret: string,
    userService: UserService
  ) {
    const exchangeCode = async (code: string) => {
      const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {},
        {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );
      return response.data.access_token;
    };

    const fetchUserInfo = async (token: string) => {
      //fetch basic user info
      const user = await axios
        .get("https://api.github.com/user", {
          headers: { Authorization: "token " + token },
        })
        .then((res) => res.data);
      //fetch user's emails
      const emails: Array<any> = await axios
        .get("https://api.github.com/user/emails", {
          headers: { Authorization: "token " + token },
        })
        .then((res) => res.data);
      //select user's primary email address
      const email = emails.find((val) => val.primary)?.email;
      //format user and return
      return { username: user.login, email: email };
    };

    super(
      exchangeCode,
      fetchUserInfo,
      userService,
      `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`
    );
  }
}

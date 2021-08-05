import userModel from "../../user";
import GithubService from "./github_service";

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
if (!clientId || !clientSecret)
  throw new Error("github oauth credentials missing");

const githubService = new GithubService(clientId, clientSecret, userModel);

export default githubService;

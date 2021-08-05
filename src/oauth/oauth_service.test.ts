import { describe, it } from "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import OauthService from "./oauth_service";
import UserModel from "../user/user.model";
import InMemoryDatabaseCollection from "../db/memory_collection";
import User from "../user/user.interface";
import UserService from "../user/user_service";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("oauth service", () => {
  let oauthService: OauthService;
  let oauthUsers: { [key: string]: User };
  let userCollection: InMemoryDatabaseCollection<any>;

  beforeEach(() => {
    oauthUsers = {
      "2134": {
        username: "mahmut",
        email: "mahmut@mail.com",
      },
      "214131": {
        username: "mahmut2",
        email: "mahmut2@mail.com",
      },
      "4134": {
        username: "mahmut3",
        email: "mahmut3@mail.com",
      },
    };
    userCollection = new InMemoryDatabaseCollection();
    const userModel = new UserModel(userCollection);
    const userService = new UserService(userModel);
    oauthService = new OauthService(
      async (code: string) => {
        if (oauthUsers[code] === null || oauthUsers[code]) return code;
      },
      async (token: string) => oauthUsers[token],
      userService
    );
  });

  it("should return a user by its temp code", async () => {
    await expect(oauthService.authenticate("2134"))
      .eventually.property("username")
      .to.equal("mahmut");
  });

  it("should save user to the database", async () => {
    await oauthService.authenticate("2134");
    await expect(userCollection.findOne({ username: "mahmut" })).to.eventually
      .exist;
  });

  it("should not save if user is already authenticated", async () => {
    await userCollection.insertOne({
      username: "mahmut",
      email: "mahmut@mail.com",
    });
    await oauthService.authenticate("2134");
    await expect(
      userCollection.find({ username: "mahmut" }, {})
    ).eventually.have.lengthOf(1);
  });

  it("should throw if code is invalid", async () => {
    await expect(oauthService.authenticate("fako")).to.be.rejectedWith(/token/);
  });

  it("should throw if access token is invalid", async () => {
    // @ts-ignore
    oauthUsers["213124"] = null;
    await expect(oauthService.authenticate("213124")).to.be.rejectedWith(
      /user/
    );
  });
});

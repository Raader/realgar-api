import chai from "chai";
import { describe, it } from "mocha";
import chaiAsPromised from "chai-as-promised";
import AuthenticationService from "./auth_service";
import InMemoryDatabaseCollection from "../db/memory_collection";
import UserService from "../user/user_service";
import UserModel from "../user/user.model";
import User from "../user/user.interface";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("authentication service", () => {
  let userCollection: InMemoryDatabaseCollection<User>;
  let userService: UserService;
  let authService: AuthenticationService;

  beforeEach(() => {
    userCollection = new InMemoryDatabaseCollection();
    const userModel = new UserModel(userCollection);
    userService = new UserService(userModel);
    authService = new AuthenticationService(userService);
  });

  it("should register a user to the database", async () => {
    await expect(
      authService.register({
        username: "faruk",
        email: "faruk@mail.com",
        password: "faruk1515",
      })
    ).to.be.fulfilled;
  });

  it("should not register a user without a password", async () => {
    await expect(
      authService.register({
        username: "faruk",
        email: "faruk@mail.com",
      })
    ).to.be.rejectedWith(/password/);
  });

  it("should not register an already registered user", async () => {
    userCollection.items = [{ userame: "faruk", email: "faruk@mail.com" }];
    await expect(
      authService.register({
        username: "faruk",
        email: "faruk@mail.com",
        password: "faruk1515",
      })
    ).to.be.rejectedWith(/exists/);
  });

  it("should login user with email and password", async () => {
    await authService.register({
      username: "faruk",
      email: "faruk@mail.com",
      password: "faruk1515",
    });
    await expect(
      authService.login({ email: "faruk@mail.com", password: "faruk1515" })
    ).to.be.fulfilled;
  });

  it("should not login users who does not exist", async () => {
    await expect(
      authService.login({ email: "faruk@mail.com", password: "faruk1515" })
    ).to.be.rejectedWith(/exist/);
  });

  it("should not login users without matching passwords", async () => {
    await authService.register({
      username: "faruk",
      email: "faruk@mail.com",
      password: "faruk1515",
    });
    await expect(
      authService.login({ email: "faruk@mail.com", password: "faruk151" })
    ).to.be.rejectedWith(/password/);
  });

  it("should not login users with different auth methods", async () => {
    userCollection.items = [{ username: "faruk", email: "faruk@mail.com" }];
    await expect(
      authService.login({ email: "faruk@mail.com", password: "faruk151" })
    ).to.be.rejectedWith(/auth/);
  });
});

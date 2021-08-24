import chai from "chai";
import { describe, it } from "mocha";
import chaiAsPromised from "chai-as-promised";
import InMemoryDatabaseCollection from "../db/memory_collection";
import UserModel from "./user.model";
import User from "./user.interface";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("user model", () => {
  let dbCollection: InMemoryDatabaseCollection<User>;
  let userModel: UserModel;

  beforeEach(() => {
    dbCollection = new InMemoryDatabaseCollection();
    userModel = new UserModel(dbCollection);
  });

  describe("create", () => {
    let user: User;
    beforeEach(() => {
      user = {
        username: "mahmut",
        email: "mahmut@mail.com",
        password: "mahmut1995",
      };
    });
    it("should create an user", async () => {
      await expect(userModel.create(user)).to.be.fulfilled;
    });

    it("should not create a user without a name", async () => {
      user.username = "";
      await expect(userModel.create(user)).to.be.rejectedWith(/username/);
    });
    it("should hash user's password", async () => {
      await expect(userModel.create(user))
        .eventually.property("password")
        .to.not.equal(user.password);
    });
    it("should create a user without a password", async () => {
      await expect(userModel.create(user)).to.be.fulfilled;
    });

    it("should create a user with currency setting", async () => {
      user.settings = { currency: "USD" };
      await expect(userModel.create(user)).to.be.fulfilled;
    });

    it("should create a user with default currency usd", async () => {
      await expect(userModel.create(user))
        .to.eventually.have.property("settings")
        .to.have.property("currency");
    });

    it("should not create a user with invalid currency ", async () => {
      user.settings = { currency: "mahtmu" };
      await expect(userModel.create(user)).to.be.rejectedWith(/settings/);
    });

    it("should create user with setting notification false", async () => {
      user.settings = { notification: false };
      await expect(userModel.create(user)).to.be.fulfilled;
    });

    it("should not reate user with a not boolean notification setting", async () => {
      //@ts-ignore
      user.settings = { notification: "mahmt" };
      await expect(userModel.create(user)).to.be.rejectedWith(/settings/);
    });

    it("should create user with setting notification true default", async () => {
      await expect(userModel.create(user))
        .eventually.property("settings")
        .property("notification")
        .to.equal(true);
    });
  });

  describe("read", () => {
    beforeEach(() => {
      dbCollection.items = [
        {
          id: "0",
          username: "mahmut",
          email: "mahmut@mail.com",
          password: "mahmut1995",
        },
        {
          id: "1",
          username: "mahmut2",
          email: "mahmut2@mail.com",
          password: "mahmut1995",
        },
        {
          id: "2",
          username: "mahmut3",
          email: "mahmut3@mail.com",
          password: "mahmut1995",
        },
        {
          id: "3",
          username: "mahmut3",
          email: "mahmut3@mail.com",
          password: "mahmut1995",
        },
      ];
    });

    it("should read all users", async () => {
      await expect(userModel.read({}))
        .to.eventually.property("length")
        .to.equal(4);
    });
  });
  describe("update", () => {
    beforeEach(() => {
      const user = {
        id: "0",
        username: "mahmut",
        email: "mahmut@mail.com",
        password: "mahmut1995",
      };
      dbCollection.items.push({ ...user });
    });

    it("should update a user's username by id", async () => {
      await expect(userModel.updateOne({ id: "0" }, { username: "faruk" }))
        .eventually.property("username")
        .to.equal("faruk");
    });
  });
  describe("delete", () => {
    beforeEach(() => {
      dbCollection.items = [
        {
          id: "0",
          username: "mahmut",
          email: "mahmut@mail.com",
          password: "mahmut1995",
        },
        {
          id: "1",
          username: "mahmut2",
          email: "mahmut2@mail.com",
          password: "mahmut1995",
        },
        {
          id: "2",
          username: "mahmut3",
          email: "mahmut3@mail.com",
          password: "mahmut1995",
        },
        {
          id: "3",
          username: "mahmut3",
          email: "mahmut3@mail.com",
          password: "mahmut1995",
        },
      ];
    });

    it("should delete one user by it's id", async () => {
      await expect(userModel.deleteOne({ id: "0" })).to.be.fulfilled;
    });
  });
});

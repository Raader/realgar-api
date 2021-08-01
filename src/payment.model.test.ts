import chai from "chai";
import { describe } from "mocha";
import { nanoid } from "nanoid";
import RecurringPayment from "./payment.interface";
import { RecurringPaymentModel } from "./payment.model";
import lodash from "lodash";
import DatabaseCollection from "./database_collection";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("recurring payment model", () => {
  interface collection extends DatabaseCollection<RecurringPayment> {
    items: RecurringPayment[];
  }
  let dbCollection: collection;
  let paymentModel: RecurringPaymentModel;

  beforeEach(() => {
    dbCollection = {
      items: [],
      insertOne: async function (document: any) {
        this.items.push(document);
        return document;
      },
      findOne: async function (filter: any): Promise<any> {
        return lodash.find(this.items, filter);
      },
      find: async function (filter: any, opts: any): Promise<any[]> {
        return lodash
          .filter(this.items, filter)
          .slice(opts.skip || 0, opts.skip + opts.limit || 10);
      },
      updateOne: async function (filter: any, update: any): Promise<any> {
        const item = lodash.find(this.items, filter);
        return lodash.merge(item, update);
      },
      deleteOne: async function (filter: any): Promise<void> {
        const item = lodash.find(this.items, filter);
        lodash.remove(this.items, (val) => val.id === item?.id);
        return;
      },
      deleteMany: async function (filter: any): Promise<void> {
        const items = lodash.filter(this.items, filter);
        for (const item of items) {
          lodash.remove(this.items, (val) => val.id === item?.id);
        }
        return;
      },
    };
    paymentModel = new RecurringPaymentModel(dbCollection, nanoid);
  });

  describe("create", () => {
    let payment: RecurringPayment;

    beforeEach(() => {
      payment = {
        name: "netflix subscription",
        price: 24,
        type: "monthly",
        startingDate: new Date("2021-08-01"),
      };
    });

    it("should be able to create a payment", async () => {
      expect(await paymentModel.create(payment)).to.exist;
    });

    it("should assign a unique id to the payment created", async () => {
      expect(await paymentModel.create(payment)).to.have.property("id");
    });

    it("should save payment to the collection", async () => {
      await paymentModel.create(payment);
      expect(dbCollection.items.length).to.equal(1);
    });

    it("should not create a payment without a name", async () => {
      payment.name = "";
      await expect(paymentModel.create(payment)).to.be.rejectedWith(/name/);
    });

    it("should not create a payment without a price", async () => {
      payment.price = 0;
      await expect(paymentModel.create(payment)).to.be.rejectedWith(/price/);
    });

    it("should not create a payment without a type", async () => {
      // @ts-ignore
      payment.type = "";
      await expect(paymentModel.create(payment)).to.be.rejectedWith(/type/);
    });

    it("should not create a payment which is not monthly or annual", async () => {
      // @ts-ignore
      payment.type = "mahmut";
      await expect(paymentModel.create(payment)).to.be.rejectedWith(/type/);
    });

    it("should not create a payment with a name longer than 200", async () => {
      payment.name =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      await expect(paymentModel.create(payment)).to.be.rejectedWith(/name/);
    });

    it("should ignore a payments extra fields", async () => {
      // @ts-ignore
      payment.extra = " ";
      // @ts-ignore
      expect((await paymentModel.create(payment)).extra).to.be.undefined;
    });

    it("should not create a payment with missing field", async () => {
      // @ts-ignore
      payment = {
        price: 24,
        type: "monthly",
        startingDate: new Date("2021-08-01"),
      };
      await expect(paymentModel.create(payment)).to.be.rejectedWith(/name/);
    });
  });

  describe("read", () => {
    beforeEach(() => {
      dbCollection.items = [
        {
          id: "1",
          name: "netflix subscription",
          price: 24,
          type: "monthly",
          startingDate: new Date("2021-08-01"),
        },
        {
          id: "2",
          name: "netflix subscription",
          price: 288,
          type: "annual",
          startingDate: new Date("2021-08-01"),
        },
        {
          id: "3",
          name: "spotify subscription",
          price: 24,
          type: "monthly",
          startingDate: new Date("2021-08-01"),
        },
        {
          id: "4",
          name: "apple music subscription",
          price: 18,
          type: "monthly",
          startingDate: new Date("2021-08-01"),
        },
      ];
    });

    it("should read one payment by its id", async () => {
      expect(await paymentModel.readOne({ id: "1" }))
        .property("id")
        .to.equal("1");
    });

    it("should read one payment by its name", async () => {
      expect(await paymentModel.readOne({ name: "spotify subscription" }))
        .property("name")
        .to.equal("spotify subscription");
    });

    it("should read all documents", async () => {
      expect((await paymentModel.read({})).length).to.equal(
        dbCollection.items.length
      );
    });

    it("should read all documetns with the same name", async () => {
      expect(
        (await paymentModel.read({ name: "netflix subscription" })).length
      ).to.equal(2);
    });

    it("should read only 2 payments of all payments", async () => {
      expect((await paymentModel.read({}, { limit: 2 })).length).to.equal(2);
    });

    it("should read and skip 1 payment of all payments", async () => {
      expect((await paymentModel.read({}, { skip: 1 })).length).to.equal(
        dbCollection.items.length - 1
      );
    });

    it("should skip 2 and read only 1 of all payments", async () => {
      expect(
        (await paymentModel.read({}, { skip: 2, limit: 1 })).length
      ).to.equal(1);
    });
  });

  describe("update", () => {
    let payment: RecurringPayment;
    beforeEach(() => {
      payment = {
        id: "213313215",
        name: "netflix subscription",
        price: 24,
        type: "monthly",
        startingDate: new Date("2021-08-01"),
      };
      dbCollection.items = [{ ...payment }];
    });
    it("should update a payments name by its id", async () => {
      expect(
        await paymentModel.updateOne({ id: payment.id }, { name: "spotify" })
      );
    });

    it("should save changes of payment to database", async () => {
      const updated = await paymentModel.updateOne(
        { id: payment.id },
        { name: "hello" }
      );
      expect(dbCollection.items[0]?.name).to.equal(updated?.name);
    });

    it("should not update a payments id", async () => {
      expect(
        (await paymentModel.updateOne({ id: payment.id }, { id: "mahmut" }))?.id
      ).to.equal(payment.id);
    });

    it("should ignore id field when updating a payment", async () => {
      expect(
        (
          await paymentModel.updateOne(
            { id: payment.id },
            { id: "mahmut", name: "spotify" }
          )
        )?.name
      ).to.equal("spotify");
    });

    it("should not let payment to have no name", async () => {
      await expect(
        paymentModel.updateOne({ id: payment.id }, { name: "" })
      ).to.be.rejectedWith(/name/);
    });

    it("should not let payment to have no price", async () => {
      await expect(
        paymentModel.updateOne({ id: payment.id }, { price: 0 })
      ).to.be.rejectedWith(/price/);
    });

    it("should ignore extra fields", async () => {
      // @ts-ignore
      expect((await paymentModel.updateOne({}, { hello: "hello" })).hello).to.be
        .undefined;
    });
  });

  describe("delete", () => {
    beforeEach(() => {
      dbCollection.items = [
        {
          id: "1",
          name: "netflix subscription",
          price: 24,
          type: "monthly",
          startingDate: new Date("2021-08-01"),
        },
        {
          id: "2",
          name: "netflix subscription",
          price: 288,
          type: "annual",
          startingDate: new Date("2021-08-01"),
        },
        {
          id: "3",
          name: "spotify subscription",
          price: 24,
          type: "monthly",
          startingDate: new Date("2021-08-01"),
        },
        {
          id: "4",
          name: "apple music subscription",
          price: 18,
          type: "monthly",
          startingDate: new Date("2021-08-01"),
        },
      ];
    });

    it("should delete a payment by its id", async () => {
      await expect(paymentModel.deleteOne({ id: "1" })).to.be.fulfilled;
    });

    it("should remove it from the collection", async () => {
      await paymentModel.deleteOne({ id: "1" });
      expect(dbCollection.findOne({ id: "1" })).to.be.empty;
    });

    it("should delete all payments with the same name", async () => {
      await expect(paymentModel.deleteMany({ name: "netflix subscription" })).to
        .be.fulfilled;
    });
  });
});

import chai from "chai";
import { describe } from "mocha";
import RecurringPayment from "./payment.interface";
import RecurringPaymentModel from "./payment.model";
import DataCollection from "../db/data_collection";
import chaiAsPromised from "chai-as-promised";
import InMemoryDatabaseCollection from "../db/memory_collection";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("recurring payment model", () => {
  interface collection extends DataCollection<RecurringPayment> {
    items: RecurringPayment[];
  }
  let dbCollection: collection;
  let paymentModel: RecurringPaymentModel;

  beforeEach(() => {
    dbCollection = new InMemoryDatabaseCollection<RecurringPayment>();
    paymentModel = new RecurringPaymentModel(dbCollection);
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

    it("should not create a payments extra fields", async () => {
      // @ts-ignore
      payment.extra = " ";
      await expect(paymentModel.create(payment)).to.be.rejectedWith(/extra/);
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

    it("should create a payment with an icon field", async () => {
      payment.icon = "netflix";
      await expect(paymentModel.create(payment)).to.be.fulfilled;
    });

    it("should not create a payment with an icon name longer than 200", async () => {
      payment.icon =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      await expect(paymentModel.create(payment)).to.be.rejectedWith(/icon/);
    });

    it("should have last payment date on create", async () => {
      await expect(paymentModel.create(payment)).to.eventually.have.property(
        "lastDate"
      );
    });

    it("should have next payment date on create", async () => {
      await expect(paymentModel.create(payment)).to.eventually.have.property(
        "nextDate"
      );
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

    it("should have last payment date on readOne", async () => {
      await expect(
        paymentModel.readOne({ id: "1" })
      ).to.eventually.have.property("lastDate");
    });

    it("should have next payment date on readOne", async () => {
      await expect(
        paymentModel.readOne({ id: "1" })
      ).to.eventually.have.property("nextDate");
    });

    it("should have last payment date on read", async () => {
      const payments = await paymentModel.read({});
      for (const payment of payments) {
        expect(payment).to.have.property("lastDate");
      }
    });

    it("should have next payment date on read", async () => {
      const payments = await paymentModel.read({});
      for (const payment of payments) {
        expect(payment).to.have.property("nextDate");
      }
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
      await expect(
        paymentModel.updateOne({ id: payment.id }, { name: "spotify" })
      ).to.be.fulfilled;
    });

    it("should save changes of payment to database", async () => {
      const updated = await paymentModel.updateOne(
        { id: payment.id },
        { name: "hello" }
      );
      expect(dbCollection.items[0]?.name).to.equal(updated?.name);
    });

    it("should not update a payments id", async () => {
      await expect(
        paymentModel.updateOne({ id: payment.id }, { id: "mahmut" })
      ).to.be.rejectedWith(/id/);
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

    it("should not ignore extra fields", async () => {
      // @ts-ignore
      await expect(
        // @ts-ignore
        paymentModel.updateOne({ id: payment.id }, { hello: "hello" })
      ).to.be.rejectedWith(/hello/);
    });

    it("should have last payment date on update", async () => {
      await expect(
        paymentModel.updateOne({ id: payment.id }, { name: "spotify" })
      ).to.eventually.have.property("lastDate");
    });

    it("should have next payment date on update", async () => {
      await expect(
        paymentModel.updateOne({ id: payment.id }, { name: "spotify" })
      ).to.eventually.have.property("nextDate");
    });

    it("should update lastNotified field", async () => {
      await expect(
        paymentModel.updateOne({ id: payment.id }, { lastNotified: new Date() })
      ).to.eventually.have.property("lastNotified");
    });

    it("should not update lastNotified field if value is not date", async () => {
      await expect(
        // @ts-ignore
        paymentModel.updateOne({ id: payment.id }, { lastNotified: "mahmut" })
      ).to.be.rejectedWith(/lastNotified/);
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

  describe("virtual fields", () => {
    it("should calculate last payment correct on monthly payment", () => {
      const payment: RecurringPayment = {
        name: "netflix subscription",
        price: 24,
        type: "monthly",
        startingDate: new Date("2021-07-08"),
      };
      const lastPaymentDate = new Date("2021-08-07");

      const currentDate = new Date("2021-08-19");

      expect(
        paymentModel.calculateLastPayment(payment, currentDate).toDateString()
      ).to.equal(lastPaymentDate.toDateString());
    });

    it("should calculate last payment correct on annual payment", () => {
      const payment: RecurringPayment = {
        name: "netflix subscription",
        price: 24,
        type: "annual",
        startingDate: new Date("2020-08-19"),
      };
      const lastPaymentDate = new Date("2021-08-19");

      const currentDate = new Date("2021-08-20");

      expect(
        paymentModel.calculateLastPayment(payment, currentDate).toDateString()
      ).to.equal(lastPaymentDate.toDateString());
    });

    it("should calculate last payment correnct multiple months apart on monthly payment", () => {
      const payment: RecurringPayment = {
        name: "netflix subscription",
        price: 24,
        type: "monthly",
        startingDate: new Date("2021-04-19"),
      };
      const lastPaymentDate = new Date("2021-08-17");

      const currentDate = new Date("2021-08-19");

      expect(
        paymentModel.calculateLastPayment(payment, currentDate).toDateString()
      ).to.equal(lastPaymentDate.toDateString());
    });

    it("should calculate next payment correct on monthly payment", () => {
      const payment: RecurringPayment = {
        name: "netflix subscription",
        price: 24,
        type: "monthly",
        startingDate: new Date("2021-07-08"),
        lastDate: new Date("2021-08-07"),
      };

      const currentDate = new Date("2021-08-19");

      const nextPayment = new Date("2021-09-06");

      expect(
        paymentModel.calculateNextPayment(payment).toDateString()
      ).to.equal(nextPayment.toDateString());
    });

    it("should calculate next payment correct on annual payment", () => {
      const payment: RecurringPayment = {
        name: "netflix subscription",
        price: 24,
        type: "annual",
        startingDate: new Date("2021-07-08"),
        lastDate: new Date("2021-08-07"),
      };

      const currentDate = new Date("2021-08-19");

      const nextPayment = new Date("2022-08-07");

      expect(
        paymentModel.calculateNextPayment(payment).toDateString()
      ).to.equal(nextPayment.toDateString());
    });
  });
});

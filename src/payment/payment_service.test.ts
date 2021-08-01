import chai from "chai";
import { describe, it } from "mocha";
import chaiAsPromised from "chai-as-promised";
import RecurringPaymentService from "./payment_service";
import InMemoryDatabaseCollection from "../db/memory_collection";
import { RecurringPaymentModel } from "./payment.model";
import { nanoid } from "nanoid";
import RecurringPayment from "./payment.interface";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("recurring payment service", () => {
  let dbCollection: InMemoryDatabaseCollection<RecurringPayment>;
  let paymentService: RecurringPaymentService;

  beforeEach(() => {
    dbCollection = new InMemoryDatabaseCollection();
    const paymentModel = new RecurringPaymentModel(dbCollection, nanoid);
    paymentService = new RecurringPaymentService(paymentModel);
  });

  it("should create a payment", async () => {
    const payment: RecurringPayment = {
      name: "netflix",
      price: 12,
      type: "monthly",
      startingDate: new Date(),
    };
    await expect(paymentService.create(payment)).to.be.fulfilled;
  });
  it("should read all payments", async () => {
    dbCollection.items = [
      {
        name: "netflix",
        price: 12,
        type: "monthly",
        startingDate: new Date(),
      },
    ];
    await expect(paymentService.read()).to.eventually.have.lengthOf(1);
  });
  it("should read a payment by its id", async () => {
    dbCollection.items = [
      {
        id: "1",
        name: "netflix",
        price: 12,
        type: "monthly",
        startingDate: new Date(),
      },
    ];
    await expect(paymentService.readById("1")).to.be.fulfilled;
  });
  it("should update a payment by its id", async () => {
    dbCollection.items = [
      {
        id: "1",
        name: "netflix",
        price: 12,
        type: "monthly",
        startingDate: new Date(),
      },
    ];
    await expect(paymentService.updateById("1", { name: "spotify" }))
      .eventually.property("name")
      .to.equal("spotify");
  });
  it("should delete a payment by its id", async () => {
    dbCollection.items = [
      {
        id: "1",
        name: "netflix",
        price: 12,
        type: "monthly",
        startingDate: new Date(),
      },
    ];
    await expect(paymentService.deleteById("1")).to.be.fulfilled;
  });
});

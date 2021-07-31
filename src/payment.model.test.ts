import { expect } from "chai";
import { describe } from "mocha";
import { nanoid } from "nanoid";
import RecurringPayment from "./payment.interface";
import { RecurringPaymentModel } from "./payment.model";

describe("recurring payment model", () => {
  let dbCollection: { items: any[]; insertOne: (a: any) => Promise<any> };
  let paymentModel: RecurringPaymentModel;
  let payment: RecurringPayment;

  beforeEach(() => {
    dbCollection = {
      items: [],
      insertOne: async function (document: any) {
        this.items.push(document);
        return document;
      },
    };
    paymentModel = new RecurringPaymentModel(dbCollection, nanoid);
    payment = {
      name: "netflix subscription",
      price: 24,
      type: "monthly",
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
    expect(await paymentModel.create(payment)).to.not.exist;
  });

  it("should not create a payment without a price", async () => {
    payment.price = 0;
    expect(await paymentModel.create(payment)).to.not.exist;
  });

  it("should not create a payment without a type", async () => {
    // @ts-ignore
    payment.type = "";
    expect(await paymentModel.create(payment)).to.not.exist;
  });

  it("should not create a payment which is not monthly or annual", async () => {
    // @ts-ignore
    payment.type = "mahmut";
    expect(await paymentModel.create(payment)).to.not.exist;
  });

  it("should not create a payment with a name longer than 200", async () => {
    payment.name =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    expect(await paymentModel.create(payment)).to.not.exist;
  });
});

import chai from "chai";
import { describe, it } from "mocha";
import chaiAsPromised from "chai-as-promised";
import PaymentNotificationService from "./notification_service";
import UserService from "../user/user_service";
import UserModel from "../user/user.model";
import InMemoryDatabaseCollection from "../db/memory_collection";
import RecurringPaymentModel from "../payment/payment.model";
import RecurringPaymentService from "../payment/payment_service";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("notification service", () => {
  xit("should send notifications", async () => {
    const userCollection = new InMemoryDatabaseCollection();
    const userModel = new UserModel(userCollection);
    const userService = new UserService(userModel);
    const paymentCollection = new InMemoryDatabaseCollection();
    const paymentModel = new RecurringPaymentModel(paymentCollection);
    const paymentService = new RecurringPaymentService(paymentModel);

    const notificationService = new PaymentNotificationService(
      userService,
      paymentService
    );

    userCollection.items = [
      { id: "1", username: "faruk", email: "faruk@mail.com" },
    ];
    paymentCollection.items = [
      {
        id: "2313",
        userId: "1",
        name: "netflix subscription",
        price: 24,
        type: "monthly",
        startingDate: new Date("2021-07-20"),
      },
      {
        id: "2313212",
        userId: "1",
        name: "spotify subscription",
        price: 24,
        type: "monthly",
        startingDate: new Date("2021-07-25"),
      },
      {
        id: "2313212",
        userId: "1",
        name: "spotify subscription",
        price: 24,
        type: "monthly",
        startingDate: new Date("2021-07-25"),
        lastNotified: new Date("2021-08-22"),
      },
    ];

    const now = new Date("2021-08-22");
    const sent: any = [];
    await notificationService.sendNotifications((user, payment) => {
      sent.push(payment);
      console.log(payment);
    }, now);

    expect(sent.length).to.equal(1);
    expect(sent[0]).property("name").to.equal("spotify subscription");
  });
});

import RecurringPayment from "./payment.interface";
import { isSubscriptionPlan } from "./subscription_plan.type";
import DatabaseCollection from "../db/database_collection";
import DatabaseModel from "../db/database_model";

export default class RecurringPaymentModel extends DatabaseModel<RecurringPayment> {
  constructor(collection: DatabaseCollection<RecurringPayment>) {
    super(collection, {
      userId: (val: any) => {
        if (val) return typeof val === "string";
        return true;
      },
      name: (val: any) => val && typeof val === "string" && val.length < 200,
      price: (val: any) => val && typeof val === "number",
      type: (val: any) => val && isSubscriptionPlan(val),
      startingDate: (val: any) => {
        if (val) {
          const date = new Date(val);
          return !!date.getTime();
        }
        return true;
      },
    });
  }

  create(document: RecurringPayment): Promise<RecurringPayment | undefined> {
    document = {
      ...document,
      startingDate: document.startingDate
        ? new Date(document.startingDate)
        : new Date(),
    };
    return super.create(document);
  }
}

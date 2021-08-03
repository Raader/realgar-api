import RecurringPayment from "./payment.interface";
import { isSubscriptionPlan } from "./subscription_plan.type";
import DatabaseCollection from "../db/database_collection";
import DatabaseModel from "../db/database_model";

export default class RecurringPaymentModel extends DatabaseModel<RecurringPayment> {
  constructor(collection: DatabaseCollection<RecurringPayment>) {
    super(collection, {
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
}

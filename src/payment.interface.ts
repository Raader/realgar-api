import SubscriptionPlan from "./subscription_plan.type";

export default interface RecurringPayment {
  id?: string;
  name: string;
  price: number;
  type: SubscriptionPlan;
}

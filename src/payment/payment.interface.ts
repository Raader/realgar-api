import SubscriptionPlan from "./subscription_plan.type";

export default interface RecurringPayment {
  userId?: string;
  id?: string;
  name: string;
  price: number;
  type: SubscriptionPlan;
  startingDate: Date;
  icon?: string;
  currency?: string;
  lastDate?: Date;
  nextDate?: Date;
  lastNotified?: Date;
}

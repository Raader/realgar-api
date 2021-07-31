import RecurringPayment from "./payment.interface";
import DataModel from "./data.model";
import { isSubscriptionPlan } from "./subscription_plan.type";

interface DatabaseCollection<Type> {
  insertOne: (document: Type) => Promise<Type>;
}

type GenerateId = (length?: number) => string;

export class RecurringPaymentModel implements DataModel<RecurringPayment> {
  paymentCollection: DatabaseCollection<RecurringPayment>;
  generateId: GenerateId;

  constructor(
    paymentCollection: DatabaseCollection<RecurringPayment>,
    generateId: GenerateId
  ) {
    this.paymentCollection = paymentCollection;
    this.generateId = generateId;
  }

  async findOne(
    filter: Partial<RecurringPayment>
  ): Promise<RecurringPayment | undefined> {
    return;
  }

  async create(
    payment: Partial<RecurringPayment>
  ): Promise<RecurringPayment | undefined> {
    if (!payment.name || payment.name.length > 200) return;
    if (!payment.price) return;
    if (!payment.type || !isSubscriptionPlan(payment.type)) return;
    return await this.paymentCollection.insertOne({
      id: this.generateId(),
      name: payment.name,
      price: payment.price,
      type: payment.type,
    });
  }
}

import RecurringPayment from "./payment.interface";
import DataModel from "./data.model";
import { isSubscriptionPlan } from "./subscription_plan.type";

export interface DatabaseCollection<Type> {
  insertOne: (document: Type) => Promise<Type>;
  findOne: (filter: Partial<Type>) => Promise<Type>;
  find: (
    filter: Partial<Type>,
    opts?: { limit?: number; skip?: number }
  ) => Promise<Type[]>;
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
      startingDate: payment.startingDate || new Date(),
    });
  }

  async read(
    filter: Partial<RecurringPayment>,
    { limit, skip }: { limit?: number; skip?: number } = {}
  ): Promise<RecurringPayment[]> {
    limit = limit || 10;
    skip = skip || 0;
    const payments = await this.paymentCollection.find(filter, {
      limit: limit,
      skip: skip,
    });
    return payments;
  }

  async readOne(
    filter: Partial<RecurringPayment>
  ): Promise<RecurringPayment | undefined> {
    return await this.paymentCollection.findOne(filter);
  }
}

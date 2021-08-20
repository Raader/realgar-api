import RecurringPayment from "./payment.interface";
import { isSubscriptionPlan } from "./subscription_plan.type";
import DataCollection from "../db/data_collection";
import DatabaseModel from "../db/database_model";

export default class RecurringPaymentModel extends DatabaseModel<RecurringPayment> {
  constructor(collection: DataCollection<RecurringPayment>) {
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
      icon: (val: any) => {
        if (val) {
          return typeof val === "string" && val.length < 200;
        }
        return true;
      },
      currency: (val: any) => {
        if (val) {
          return typeof val === "string" && val.length === 3;
        }
        return true;
      },
    });
  }

  calculateLastPayment(payment: RecurringPayment, currentDate?: Date): Date {
    currentDate = currentDate || new Date();
    const monthInMilliSeconds = 30 * 24 * 60 * 60 * 1000;
    const yearInMilliSeconds = 365 * 24 * 60 * 60 * 1000;

    const date = new Date(payment.startingDate);
    while (date) {
      if (payment.type === "monthly") {
        if (date.getTime() + monthInMilliSeconds <= currentDate.getTime()) {
          date.setDate(date.getDate() + 30);
        } else break;
      } else {
        if (date.getTime() + yearInMilliSeconds <= currentDate.getTime()) {
          date.setFullYear(date.getFullYear() + 1);
        } else break;
      }
    }

    return date;
  }

  async create(
    payment: RecurringPayment
  ): Promise<RecurringPayment | undefined> {
    payment = {
      ...payment,
      startingDate: payment.startingDate
        ? new Date(payment.startingDate)
        : new Date(),
      currency: payment.currency ? payment.currency.toUpperCase() : "USD",
    };
    const document = await super.create(payment);
    if (document) {
      return { ...document, lastDate: this.calculateLastPayment(document) };
    }
  }

  async read(
    filter: Partial<RecurringPayment>,
    opts?: { limit?: number; skip?: number }
  ): Promise<RecurringPayment[]> {
    const documents = await super.read(filter, opts);

    return documents.map((document) => ({
      ...document,
      lastDate: this.calculateLastPayment(document),
    }));
  }

  async readOne(
    filter: Partial<RecurringPayment>
  ): Promise<RecurringPayment | undefined> {
    const document = await super.readOne(filter);
    if (document) {
      document.lastDate = this.calculateLastPayment(document);
    }
    return document;
  }

  async updateOne(
    filter: Partial<RecurringPayment>,
    update: Partial<RecurringPayment>
  ): Promise<RecurringPayment | undefined> {
    const document = await super.updateOne(filter, update);
    if (document)
      return {
        ...document,
        lastDate: this.calculateLastPayment(document),
      };
  }
}

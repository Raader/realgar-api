import RecurringPayment from "./payment.interface";
import DataModel from "../db/data.model";
import { isSubscriptionPlan } from "./subscription_plan.type";
import DatabaseCollection from "../db/database_collection";
import Validator from "../validation/validator";

type GenerateId = (length?: number) => string;

type DataValidator<Type> = {
  [Property in keyof Type]: (val: any) => boolean;
};

export class RecurringPaymentModel implements DataModel<RecurringPayment> {
  private paymentCollection: DatabaseCollection<RecurringPayment>;
  generateId: GenerateId;
  private validator: Validator<RecurringPayment>;

  constructor(
    paymentCollection: DatabaseCollection<RecurringPayment>,
    generateId: GenerateId
  ) {
    this.paymentCollection = paymentCollection;
    this.generateId = generateId;
    this.validator = new Validator<RecurringPayment>({
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

  async create(
    payment: RecurringPayment
  ): Promise<RecurringPayment | undefined> {
    //if field is not valid return
    this.validator.validate(payment);
    return await this.paymentCollection.insertOne({
      ...payment,
      id: this.generateId(),
      startingDate: payment.startingDate
        ? new Date(payment.startingDate)
        : new Date(),
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

  async updateOne(
    filter: Partial<RecurringPayment>,
    update: Partial<RecurringPayment>
  ): Promise<RecurringPayment | undefined> {
    const skimmedUpdate: any = {};
    const editableFields: Array<keyof RecurringPayment> = [
      "name",
      "price",
      "type",
      "startingDate",
    ];
    for (const field of Object.keys(update) as Array<keyof RecurringPayment>) {
      if (editableFields.includes(field)) {
        skimmedUpdate[field] = update[field];
      }
    }
    this.validator.validate(
      skimmedUpdate,
      false,
      Object.keys(skimmedUpdate) as Array<keyof RecurringPayment>
    );
    const payment = await this.paymentCollection.updateOne(
      filter,
      skimmedUpdate
    );
    return payment;
  }

  async deleteOne(filter: Partial<RecurringPayment>): Promise<void> {
    await this.paymentCollection.deleteOne(filter);
    return;
  }

  async deleteMany(filter: Partial<RecurringPayment>): Promise<void> {
    await this.paymentCollection.deleteMany(filter);
    return;
  }
}

import RecurringPayment from "./payment.interface";
import DataModel from "./data.model";
import { isSubscriptionPlan } from "./subscription_plan.type";
import DatabaseCollection from "./database_collection";

type GenerateId = (length?: number) => string;

type DataValidator<Type> = {
  [Property in keyof Type]: (val: any) => boolean;
};

export class RecurringPaymentModel implements DataModel<RecurringPayment> {
  paymentCollection: DatabaseCollection<RecurringPayment>;
  generateId: GenerateId;
  validator: DataValidator<RecurringPayment>;

  constructor(
    paymentCollection: DatabaseCollection<RecurringPayment>,
    generateId: GenerateId
  ) {
    this.paymentCollection = paymentCollection;
    this.generateId = generateId;
    this.validator = {
      name: (val: any) => val && typeof val === "string" && val.length < 200,
      price: (val: any) => val && typeof val === "number",
      type: (val: any) => val && isSubscriptionPlan(val),
      startingDate: (val: any) => val && val instanceof Date,
    };
  }

  async create(
    payment: RecurringPayment
  ): Promise<RecurringPayment | undefined> {
    const fieldsToValidate: Array<keyof RecurringPayment> = Object.keys(
      payment
    ) as Array<keyof RecurringPayment>;
    //if field is not valid return
    for (const field of fieldsToValidate) {
      if (!this.validator[field]) continue;
      if (!this.validator[field]?.(payment[field])) {
        return;
      }
    }
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
    for (const field of editableFields) {
      const value = update[field];
      if (value && this.validator[field]?.(value)) {
        skimmedUpdate[field] = value;
      }
    }
    const payment = await this.paymentCollection.updateOne(
      filter,
      skimmedUpdate
    );
    return payment;
  }
}

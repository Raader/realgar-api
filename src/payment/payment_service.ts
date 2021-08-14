import DataModel from "../db/data_model";
import RecurringPayment from "./payment.interface";

export default class RecurringPaymentService {
  private paymentModel: DataModel<RecurringPayment>;

  constructor(paymentModel: DataModel<RecurringPayment>) {
    this.paymentModel = paymentModel;
  }

  async create(
    resource: RecurringPayment
  ): Promise<RecurringPayment | undefined> {
    return this.paymentModel.create(resource);
  }

  async read(filter = {}, skip = 0, limit = 10): Promise<RecurringPayment[]> {
    return this.paymentModel.read(filter, { skip, limit });
  }

  async readById(id: string): Promise<RecurringPayment | undefined> {
    return this.paymentModel.readOne({ id });
  }

  async readOne(
    filter: Partial<RecurringPayment>
  ): Promise<RecurringPayment | undefined> {
    return this.paymentModel.readOne(filter);
  }

  async updateById(
    id: string,
    update: Partial<RecurringPayment>
  ): Promise<RecurringPayment | undefined> {
    return this.paymentModel.updateOne({ id }, update);
  }

  async updateOne(
    filter: Partial<RecurringPayment>,
    update: Partial<RecurringPayment>
  ): Promise<RecurringPayment | undefined> {
    return this.paymentModel.updateOne(filter, update);
  }

  async deleteById(id: string): Promise<void> {
    return this.paymentModel.deleteOne({ id });
  }

  async deleteOne(filter: Partial<RecurringPayment>): Promise<void> {
    return this.paymentModel.deleteOne(filter);
  }
}

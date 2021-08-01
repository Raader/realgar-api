import DataModel from "../db/data.model";
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

  async read(skip: number, limit: number): Promise<RecurringPayment[]> {
    return this.paymentModel.read({}, { skip, limit });
  }

  async readById(id: string): Promise<RecurringPayment | undefined> {
    return this.paymentModel.readOne({ id });
  }

  async updateById(
    id: string,
    update: Partial<RecurringPayment>
  ): Promise<RecurringPayment | undefined> {
    return this.paymentModel.updateOne({ id }, update);
  }

  async deleteById(id: string): Promise<void> {
    return this.paymentModel.deleteOne({ id });
  }
}

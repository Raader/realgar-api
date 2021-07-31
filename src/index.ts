import DataModel from "./data.model";
import RecurringPayment from "./payment.interface";

type ID = string;

export class RecurringPaymentService {
  private paymentModel: DataModel<RecurringPayment>;

  constructor(paymentModel: DataModel<RecurringPayment>) {
    this.paymentModel = paymentModel;
  }

  async create(
    resource: RecurringPayment
  ): Promise<RecurringPayment | undefined> {
    return;
  }

  async read(skip: number, limit: number): Promise<RecurringPayment[]> {
    return [];
  }

  async readById(id: ID): Promise<RecurringPayment | undefined> {
    return;
  }

  async updateById(
    id: ID,
    update: Partial<RecurringPayment>
  ): Promise<RecurringPayment | undefined> {
    return;
  }

  async deleteById(id: ID): Promise<RecurringPayment | undefined> {
    return;
  }
}

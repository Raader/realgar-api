import RecurringPaymentService from "./payment_service";
import RecurringPaymentModel from "./payment.model";
import RecurringPayment from "./payment.interface";
import createMongoCollection from "../db/mongo";

const paymentCollection = createMongoCollection<RecurringPayment>("payments");
const paymentModel = new RecurringPaymentModel(paymentCollection);
const paymentService = new RecurringPaymentService(paymentModel);
export default paymentService;

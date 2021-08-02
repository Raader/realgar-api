import RecurringPaymentService from "./payment_service";
import { RecurringPaymentModel } from "./payment.model";
import InMemoryDatabaseCollection from "../db/memory_collection";
import { nanoid } from "nanoid";

const paymentCollection = new InMemoryDatabaseCollection();
const paymentModel = new RecurringPaymentModel(paymentCollection, nanoid);
const paymentService = new RecurringPaymentService(paymentModel);
export default paymentService;

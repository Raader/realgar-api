import RecurringPaymentService from "./payment_service";
import RecurringPaymentModel from "./payment.model";
import InMemoryDatabaseCollection from "../db/memory_collection";
import { nanoid } from "nanoid";
import MongoCollection from "../db/mongo/mongo_collection";
import RecurringPayment from "./payment.interface";
import mongoDatabase from "../db/mongo";

const paymentCollection = new MongoCollection<RecurringPayment>(
  mongoDatabase,
  "payments"
);
const paymentModel = new RecurringPaymentModel(paymentCollection);
const paymentService = new RecurringPaymentService(paymentModel);
export default paymentService;

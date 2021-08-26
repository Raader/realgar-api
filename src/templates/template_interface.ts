import RecurringPayment from "../payment/payment.interface";

export default interface PaymentTemplate extends RecurringPayment {
  service: string;
}

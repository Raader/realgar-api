import RecurringPayment from "../payment/payment.interface";
import RecurringPaymentService from "../payment/payment_service";
import User from "../user/user.interface";
import UserService from "../user/user_service";

export default class PaymentNotificationService {
  private userService: UserService;
  private paymentService: RecurringPaymentService;
  private offset: number;

  constructor(
    userService: UserService,
    paymentService: RecurringPaymentService,
    offset?: number
  ) {
    this.userService = userService;
    this.paymentService = paymentService;
    this.offset = offset || 1000 * 60 * 60 * 24 * 2;
  }

  sendNotifications = async (
    notifyHandler: (user: User, payment: RecurringPayment) => void,
    now?: Date
  ): Promise<void> => {
    const currentDate = now || new Date();
    const offset = this.offset;

    function paymentHasBeenNotified(
      payment: RecurringPayment
    ): boolean | undefined {
      return (
        payment.lastNotified &&
        payment.lastDate &&
        payment.lastNotified.getTime() > payment.lastDate.getTime()
      );
    }

    function paymentShouldBeNotified(payment: RecurringPayment) {
      return (
        payment.id &&
        payment.nextDate &&
        payment.nextDate?.getTime() - offset <= currentDate.getTime()
      );
    }

    return this.forEachPaymentOfUser((user, payment) => {
      if (paymentHasBeenNotified(payment)) return;
      if (payment.id && paymentShouldBeNotified(payment)) {
        this.paymentService.updateById(payment.id, {
          lastNotified: currentDate,
        });
        notifyHandler(user, payment);
      }
    });
  };

  private forEachPaymentOfUser(
    fn: (user: User, payment: RecurringPayment) => void
  ): Promise<void> {
    return this.userService.forEach((user) => {
      this.paymentService.forEach(
        (payment) => {
          fn(user, payment);
        },
        { userId: user.id }
      );
    });
  }
}
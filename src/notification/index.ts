import emailService from "../email";
import paymentService from "../payment";
import userService from "../user";
import PaymentNotificationService from "./notification_service";

const delay = Number(process.env.NOTIFICATION_INTERVAL) || 300000;

let interval: NodeJS.Timer;

const notificationService = new PaymentNotificationService(
  userService,
  paymentService
);

function handleInterval() {
  console.log("started sending notifications");
  notificationService.sendNotifications((user, payment) => {
    emailService.sendMail({
      to: user.email,
      from: "realgar@raader.me",
      subject: `Payment notification for ${payment.name}`,
      text: `You are about to be charged ${payment.price} ${
        user.settings?.currency || "USD"
      } for ${payment.name}`,
    });
  });
}

export function startNotificationInterval(): void {
  interval = setInterval(handleInterval, delay);
}

export function stopNotificationInterval(): void {
  clearInterval(interval);
}

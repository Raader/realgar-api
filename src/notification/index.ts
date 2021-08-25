import emailService from "../email";
import paymentService from "../payment";
import userService from "../user";
import PaymentNotificationService from "./notification_service";

const delay = Number(process.env.NOTIFICATION_INTERVAL) || 300000;
console.log(`notification interval is ${delay}ms`);

let interval: NodeJS.Timer | undefined;

const notificationService = new PaymentNotificationService(
  userService,
  paymentService
);

function handleInterval() {
  console.log("started sending notifications");
  notificationService.sendNotifications((user, payment) => {
    console.log(`sent notifications to user: ${user.username}`);
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
  if (interval) return;
  interval = setInterval(handleInterval, delay);
}

export function stopNotificationInterval(): void {
  if (interval) {
    clearInterval(interval);
    interval = undefined;
  }
}

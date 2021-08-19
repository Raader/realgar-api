import nodemailer from "nodemailer";
import EmailService from "./email_service";
import Email from "./email_interface";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporterConfig: SMTPTransport.Options = {
  host: process.env.SMTP_HOST || " ",
  port: Number(process.env.SMTP_PORT) ? Number(process.env.SMTP_PORT) : 80,
  auth: {
    user: process.env.SMTP_USER || " ",
    pass: process.env.SMTP_PASS || " ",
  },
};

const transporter = nodemailer.createTransport(transporterConfig);

const emailService = new EmailService({
  sendMail: async (opts: Partial<Email>) => {
    await transporter.sendMail(opts);
    return;
  },
});

export default emailService;

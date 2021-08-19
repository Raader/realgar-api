import Email from "./email_interface";

export interface Transporter {
  sendMail: (opts: Partial<Email>) => Promise<void>;
}

export default class EmailService {
  transporter: Transporter;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  async sendMail(mail: Email): Promise<void> {
    return await this.transporter.sendMail(mail);
  }
}

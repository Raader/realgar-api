export interface Transporter {
  sendMail: (opts: {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
  }) => Promise<void>;
}

export default class EmailService {
  transporter: Transporter;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  async sendMail(mail: {
    from: string;
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    return await this.transporter.sendMail(mail);
  }
}

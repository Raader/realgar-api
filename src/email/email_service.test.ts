import { describe, it } from "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import EmailService, { Transporter } from "./email_service";

chai.use(chaiAsPromised);
const expect = chai.expect;

interface mockTransporter extends Transporter {
  mails: Array<{
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
  }>;
}

describe("email service", () => {
  let transporter: mockTransporter;
  let emailService: EmailService;

  beforeEach(() => {
    transporter = {
      mails: [],
      sendMail: async function (opts: {
        from?: string;
        to?: string;
        subject?: string;
        text?: string;
      }): Promise<void> {
        const { from, to, subject, text } = opts;
        this.mails.push({ from, to, subject, text });
        return;
      },
    };
    emailService = new EmailService(transporter);
  });

  it("should send an email", async () => {
    await expect(
      emailService.sendMail({
        from: "fako@mail.com",
        to: "faruk@mail.com",
        subject: "helo",
        text: "hello",
      })
    ).to.be.fulfilled;
  });

  it("should actually send the email", async () => {
    await emailService.sendMail({
      from: "fako@mail.com",
      to: "faruk@mail.com",
      subject: "helo",
      text: "hello",
    });

    expect(transporter.mails.length).to.equal(1);
  });
});

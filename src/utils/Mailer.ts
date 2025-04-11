// @ts-types="npm:@types/nodemailer"
import nodemailer from "npm:nodemailer";

function containsValidHTML(input: string): boolean {
  // Regular expression to match HTML tags
  const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlTagPattern.test(input);
}

type Carrier =
  | "tmobile"
  | "verizon"
  | "at&t"
  | "cricket"
  | "boost"
  | "googlefi"
  | "metro";
export class Mailer {
  private transporter: ReturnType<typeof nodemailer.createTransport>;
  constructor(
    public readonly senderEmail: string,
    public readonly senderPassword: string
  ) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail, // Replace with your Gmail address
        pass: senderPassword, // Replace with your Gmail password or App Password
      },
    });
  }

  async sendEmail({
    message,
    recipient,
    subject,
    attachmentUrls,
  }: {
    recipient: string;
    subject: string;
    message: string;
    attachmentUrls?: {
      url: string;
      filename: string;
    }[];
  }) {
    // check if message has HTML
    let isHtml = false;
    if (containsValidHTML(message)) {
      isHtml = true;
    }

    const subjectBody = isHtml ? { html: message } : { text: message };
    // Email options
    const mailOptions = {
      from: this.senderEmail, // Sender address
      to: recipient, // Receiver address (your Gmail)
      subject: subject, // Subject line
      ...subjectBody,
    };

    try {
      // Send the email
      const attachments = (() => {
        const u =
          attachmentUrls?.map((info) => ({
            path: info.url,
            filename: info.filename,
          })) || [];
        return [...u];
      })();
      const info = await this.transporter.sendMail({
        ...mailOptions,
        attachments,
      });
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  private getCarrierGateway(carrier: Carrier) {
    const carrierToGateway: Record<Carrier, string> = {
      tmobile: "tmomail.net",
      verizon: "vtext.com",
      "at&t": "txt.att.net",
      cricket: "sms.cricketwireless.net",
      boost: "myboostmobile.com",
      googlefi: "msg.fi.google.com",
      metro: "mymetropcs.com",
    };
    return carrierToGateway[carrier];
  }

  /**
   *
   * @param phoneNumber The US 10 digit phone number
   * @param message
   */
  async sendSMS(
    phoneNumber: string,
    subject: string,
    message: string,
    options?: {
      carrier?: Carrier;
    }
  ) {
    if (!phoneNumber.match(/^\d{10}$/)) {
      throw new Error("Invalid phone number, must be 10 digits");
    }

    // SMS gateway address
    const carrier: Carrier = options?.carrier ?? "tmobile";
    const tMobileGateway = `${phoneNumber}@${this.getCarrierGateway(carrier)}`;

    // Email message details
    const mailOptions = {
      from: this.senderEmail, // Your email address
      to: tMobileGateway,
      subject: subject,
      text: message, // SMS content
    };

    try {
      // Send the email
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent:", info.response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}

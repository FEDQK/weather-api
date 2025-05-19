import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private getSubscriptionConfirmationEmail(email: string, token: string): nodemailer.SendMailOptions {
    const confirmationUrl = `${process.env.APP_URL}/confirm.html?token=${token}`;
    
    return {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Confirm Your Weather Subscription',
      html: `
        <h1>Welcome to Weather Forecasts!</h1>
        <p>Thank you for subscribing to our weather forecast service.</p>
        <p>Please click the button below to confirm your subscription:</p>
        <p>
          <a href="${confirmationUrl}" style="
            background-color: #4CAF50;
            color: white;
            padding: 14px 20px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
          ">
            Confirm Subscription
          </a>
        </p>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${confirmationUrl}</p>
        <p>If you didn't request this subscription, you can safely ignore this email.</p>
      `,
    };
  }

  private getUnsubscribeConfirmationEmail(email: string, token: string): nodemailer.SendMailOptions {
    const unsubscribeUrl = `${process.env.APP_URL}/unsubscribe.html?token=${token}`;
    
    return {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Successfully Subscribed to Weather Forecasts',
      html: `
        <h1>Subscription Confirmed!</h1>
        <p>Your subscription to our weather forecast service has been confirmed.</p>
        <p>If you ever want to unsubscribe, you can click the link below:</p>
        <p>
          <a href="${unsubscribeUrl}" style="
            background-color: #f44336;
            color: white;
            padding: 14px 20px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
          ">
            Unsubscribe
          </a>
        </p>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${unsubscribeUrl}</p>
      `,
    };
  }

  async sendSubscriptionConfirmation(email: string, token: string): Promise<void> {
    const mailOptions = this.getSubscriptionConfirmationEmail(email, token);
    await this.transporter.sendMail(mailOptions);
  }

  async sendUnsubscribeConfirmation(email: string, token: string): Promise<void> {
    const mailOptions = this.getUnsubscribeConfirmationEmail(email, token);
    await this.transporter.sendMail(mailOptions);
  }
}

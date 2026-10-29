import nodemailer, { type Transporter } from "nodemailer";
import { config } from "../config.js";
import type { NotificationInput } from "./notification.schema.js";

export class MailerService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      ...(config.smtp.user && config.smtp.password
        ? { auth: { user: config.smtp.user, pass: config.smtp.password } }
        : {}),
    });
  }

  send(notification: NotificationInput): Promise<void> {
    return this.transporter.sendMail({
      from: notification.from ?? config.smtp.from,
      to: notification.to,
      subject: notification.subject,
      ...(notification.text ? { text: notification.text } : {}),
      ...(notification.html ? { html: notification.html } : {}),
      ...(notification.replyTo ? { replyTo: notification.replyTo } : {}),
    }).then(() => undefined);
  }
}

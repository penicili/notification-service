import { MailerService } from "./mailer.service.js";
import { NotificationQueue } from "./notification.queue.js";
import type { NotificationInput } from "./notification.schema.js";

export class NotificationService {
  private readonly mailer = new MailerService();
  private readonly queue = new NotificationQueue((notification) => this.mailer.send(notification));

  enqueue(notification: NotificationInput): string {
    return this.queue.enqueue(notification).id;
  }
}

export const notificationService = new NotificationService();
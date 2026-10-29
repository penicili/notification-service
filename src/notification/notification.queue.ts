import { randomUUID } from "node:crypto";
import { logger } from "../logger.js";
import type { NotificationInput } from "./notification.schema.js";

export type QueuedNotification = NotificationInput & { id: string };
type Processor = (notification: QueuedNotification) => Promise<void>;

export class NotificationQueue {
  private readonly pending: QueuedNotification[] = [];
  private processing = false;

  constructor(private readonly processor: Processor) {}

  enqueue(notification: NotificationInput): QueuedNotification {
    const queued = { ...notification, id: randomUUID() };
    this.pending.push(queued);
    void this.process();
    return queued;
  }

  private async process(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;

    try {
      while (this.pending.length > 0) {
        const notification = this.pending.shift();
        if (!notification) {
          continue;
        }

        try {
          await this.processor(notification);
          logger.info({ id: notification.id }, "Notification sent");
        } catch (error) {
          logger.error({ id: notification.id, err: error }, "Notification failed");
        }
      }
    } finally {
      this.processing = false;
    }
  }
}

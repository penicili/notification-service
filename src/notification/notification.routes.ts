import { Router } from "express";
import { notificationService } from "./notification.service.js";
import { parseNotificationInput, ValidationError } from "./notification.schema.js";

export const notificationRouter = Router();

notificationRouter.post("/", (request, response) => {
  try {
    const notification = parseNotificationInput(request.body);
    const id = notificationService.enqueue(notification);

    response.status(202).json({ id, status: "queued" });
  } catch (error) {
    if (error instanceof ValidationError) {
      response.status(400).json({ error: error.message });
      return;
    }

    throw error;
  }
});
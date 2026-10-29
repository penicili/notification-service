import express from "express";
import { notificationRouter } from "./notification/notification.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "notification-service",
  });
});

app.use("/notifications", notificationRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ error: "Invalid JSON payload" });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});

export default app;
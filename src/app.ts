import express from "express";
import { pinoHttp } from "pino-http";
import { logger } from "./logger.js";
import { notificationRouter } from "./notification/notification.routes.js";

const app = express();

app.use(pinoHttp({ logger }));
app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "notification-service",
  });
});

app.use("/notifications", notificationRouter);

app.use((_request, response) => {
  response.status(404).json({ error: "Not found" });
});

app.use((error: unknown, request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ error: "Invalid JSON payload" });
    return;
  }

  request.log.error({ err: error }, "Unhandled error");
  response.status(500).json({ error: "Internal server error" });
});

export default app;
// Komentar buat trigger actions 10
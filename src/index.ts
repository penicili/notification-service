import app from "./app.js";
import { config } from "./config.js";
import { logger } from "./logger.js";

app.listen(config.port, config.host, () => {
  logger.info({ host: config.host, port: config.port }, "Notification service listening");
});

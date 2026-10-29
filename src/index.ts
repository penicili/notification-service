import app from "./app.js";
import { config } from "./config.js";

app.listen(config.port, config.host, () => {
  console.log(`Notification service listening on http://${config.host}:${config.port}`);
});
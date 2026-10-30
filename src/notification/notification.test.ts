import assert from "node:assert/strict";
import test from "node:test";
import { parseNotificationInput, ValidationError } from "./notification.schema.js";

test("parses a valid notification", () => {
  assert.deepEqual(parseNotificationInput({
    to: "recipient@example.com",
    subject: "Hello",
    text: "Hello from the service",
  }), {
    to: ["recipient@example.com"],
    subject: "Hello",
    text: "Hello from the service",
  });
});

test("rejects notifications without content", () => {
  assert.throws(
    () => parseNotificationInput({ to: "recipient@example.com", subject: "Hello" }),
    ValidationError,
  );
});

test("sends an email through SMTP", {
  skip: !process.env.SMTP_TEST_TO,
}, async () => {
  const { MailerService } = await import("./mailer.service.js");
  const mailer = new MailerService();

  await assert.doesNotReject(
    mailer.send({
      to: [process.env.SMTP_TEST_TO!],
      subject: "Notification service test",
      text: `This email was sent by the MailerService test at. ${new Date}`,
    }),
  );
});
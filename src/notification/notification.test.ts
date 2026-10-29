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
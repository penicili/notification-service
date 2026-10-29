export type NotificationInput = {
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
};

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const requiredString = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${field} must be a non-empty string`);
  }

  return value.trim();
};

export const parseNotificationInput = (body: unknown): NotificationInput => {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body must be an object");
  }

  const input = body as Record<string, unknown>;
  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  const to = recipients.map((recipient) => requiredString(recipient, "to"));

  if (to.length === 0 || to.some((recipient) => !isEmail(recipient))) {
    throw new ValidationError("to must contain valid email addresses");
  }

  const subject = requiredString(input.subject, "subject");
  const text = input.text === undefined ? undefined : requiredString(input.text, "text");
  const html = input.html === undefined ? undefined : requiredString(input.html, "html");

  if (!text && !html) {
    throw new ValidationError("At least one of text or html is required");
  }

  const from = input.from === undefined ? undefined : requiredString(input.from, "from");
  const replyTo = input.replyTo === undefined ? undefined : requiredString(input.replyTo, "replyTo");

  return { to, subject, ...(text ? { text } : {}), ...(html ? { html } : {}), ...(from ? { from } : {}), ...(replyTo ? { replyTo } : {}) };
};
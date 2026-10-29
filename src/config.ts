const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? "3000");

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
};

const parseHost = (value: string | undefined): string => {
  const host = value?.trim() || "0.0.0.0";

  if (host.length === 0) {
    throw new Error("HOST must not be empty");
  }

  return host;
};

const parseNodeEnvironment = (value: string | undefined): "development" | "test" | "production" => {
  const environment = value ?? "development";

  if (environment !== "development" && environment !== "test" && environment !== "production") {
    throw new Error("NODE_ENV must be one of: development, test, production");
  }

  return environment;
};

const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) {
    return defaultValue;
  }

  if (value !== "true" && value !== "false") {
    throw new Error("SMTP_SECURE must be true or false");
  }

  return value === "true";
};

const required = (name: string, value: string | undefined): string => {
  const result = value?.trim();

  if (!result) {
    throw new Error(`${name} is required`);
  }

  return result;
};

const smtpUser = process.env.SMTP_USER?.trim();
const smtpPassword = process.env.SMTP_PASSWORD;

if ((smtpUser && !smtpPassword) || (!smtpUser && smtpPassword)) {
  throw new Error("SMTP_USER and SMTP_PASSWORD must be provided together");
}

export const config = Object.freeze({
  host: parseHost(process.env.HOST),
  port: parsePort(process.env.PORT),
  nodeEnvironment: parseNodeEnvironment(process.env.NODE_ENV),
  smtp: {
    host: required("SMTP_HOST", process.env.SMTP_HOST),
    port: parsePort(process.env.SMTP_PORT ?? "587"),
    secure: parseBoolean(process.env.SMTP_SECURE, process.env.SMTP_PORT === "465"),
    user: smtpUser,
    password: smtpPassword,
    from: required("MAIL_FROM", process.env.MAIL_FROM),
  },
});

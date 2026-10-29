export const logger = {
  info(message: string, details?: unknown): void {
    console.log(message, details ?? "");
  },
  error(message: string, details?: unknown): void {
    console.error(message, details ?? "");
  },
};
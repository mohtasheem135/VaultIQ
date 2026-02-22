type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function log(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (level === "error") {
    console.error(prefix, message, context ?? "");
  } else if (level === "warn") {
    console.warn(prefix, message, context ?? "");
  } else {
    console.log(prefix, message, context ?? "");
  }

  // In production, forward to a logging service here (e.g. Axiom, Datadog)
}

export const logger = {
  info:  (msg: string, ctx?: LogContext) => log("info", msg, ctx),
  warn:  (msg: string, ctx?: LogContext) => log("warn", msg, ctx),
  error: (msg: string, ctx?: LogContext) => log("error", msg, ctx),
};

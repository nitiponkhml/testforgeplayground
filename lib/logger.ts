// Tiny pretty logger for backend route handlers.
// Color output can be toggled with LOG_COLOR=off (handy for CI log capture).

const COLORS = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

const useColor = process.env.LOG_COLOR !== "off";

function paint(color: keyof typeof COLORS, text: string): string {
  if (!useColor) return text;
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

const METHOD_COLOR: Record<string, keyof typeof COLORS> = {
  GET: "cyan",
  POST: "green",
  PUT: "yellow",
  PATCH: "yellow",
  DELETE: "red",
};

function statusColor(status: number): keyof typeof COLORS {
  if (status >= 500) return "red";
  if (status >= 400) return "yellow";
  if (status >= 300) return "magenta";
  return "green";
}

function stamp(): string {
  return paint("gray", new Date().toISOString());
}

/**
 * Log one HTTP request/response line, e.g.
 *   2026-06-22T10:00:00.000Z  POST   /api/items            201  3ms
 */
export function logRequest(
  method: string,
  path: string,
  status: number,
  startedAt: number,
  note?: string,
): void {
  const ms = Date.now() - startedAt;
  const methodTag = paint(METHOD_COLOR[method] ?? "blue", method.padEnd(6));
  const statusTag = paint(statusColor(status), String(status));
  const duration = paint("dim", `${ms}ms`);
  const suffix = note ? `  ${paint("gray", note)}` : "";
  // eslint-disable-next-line no-console
  console.log(
    `${stamp()}  ${methodTag} ${path.padEnd(22)} ${statusTag}  ${duration}${suffix}`,
  );
}

/** Log an unexpected error with a red banner. */
export function logError(scope: string, error: unknown): void {
  const msg = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(`${stamp()}  ${paint("red", paint("bold", "ERROR"))} ${paint("gray", scope)}  ${msg}`);
}

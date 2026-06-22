// Tiny config module that reads two environment variables.
// Falls back to safe defaults so the app renders predictably in tests.

export type AppConfig = {
  appEnv: string;
  supportEmail: string;
};

export function getConfig(): AppConfig {
  return {
    appEnv: process.env.APP_ENV ?? "development",
    supportEmail: process.env.SUPPORT_EMAIL ?? "support@example.com",
  };
}

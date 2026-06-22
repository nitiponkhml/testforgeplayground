import { getConfig } from "@/lib/config";

export const metadata = {
  title: "Config — TestForge Playground",
};

export default function ConfigPage() {
  const config = getConfig();

  return (
    <section data-testid="config-page">
      <h1>Config</h1>
      <p>
        Values resolved from environment variables on the server. Useful for
        env-driven and server-component tests.
      </p>
      <dl className="config-list">
        <dt>App environment</dt>
        <dd data-testid="config-app-env">{config.appEnv}</dd>
        <dt>Support email</dt>
        <dd data-testid="config-support-email">{config.supportEmail}</dd>
      </dl>
    </section>
  );
}

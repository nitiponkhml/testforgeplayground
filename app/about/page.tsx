export const metadata = {
  title: "About — TestForge Playground",
};

export default function AboutPage() {
  return (
    <section data-testid="about-page">
      <h1>About</h1>
      <p>
        TestForge Playground is a minimal Next.js 14 application built to serve
        as a sandbox for end-to-end testing tools. Each route is intentionally
        small and predictable so tests can target stable selectors.
      </p>
      <h2>Stack</h2>
      <ul>
        <li>Next.js 14 (App Router)</li>
        <li>React 18</li>
        <li>TypeScript</li>
      </ul>
    </section>
  );
}

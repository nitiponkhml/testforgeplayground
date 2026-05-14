export default function HomePage() {
  return (
    <section data-testid="home-page">
      <h1>Welcome to TestForge Playground</h1>
      <p>
        This is a tiny Next.js app with three routes used as a fixture for
        testsuite experiments. Use the navigation above to visit each page.
      </p>
      <ul>
        <li><strong>Home</strong> — this page</li>
        <li><strong>About</strong> — a static info page</li>
        <li><strong>Counter</strong> — an interactive client-side counter</li>
      </ul>
    </section>
  );
}

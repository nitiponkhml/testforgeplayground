import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "TestForge Playground",
  description: "Small Next.js app for testsuite validation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav aria-label="Primary">
            <Link href="/" data-testid="nav-home">Home</Link>
            <Link href="/about" data-testid="nav-about">About</Link>
            <Link href="/counter" data-testid="nav-counter">Counter</Link>
          </nav>
        </header>
        <main className="site-main">{children}</main>
        <footer className="site-footer">
          <small>TestForge Playground &middot; built with Next.js</small>
        </footer>
      </body>
    </html>
  );
}

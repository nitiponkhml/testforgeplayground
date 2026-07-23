# TestForge Playground

A minimal Next.js 14 app used as a fixture for testsuite experiments.

## Routes

| Path       | Purpose                                 |
| ---------- | --------------------------------------- |
| `/`        | Static landing page                     |
| `/about`   | Static info page with metadata          |
| `/counter` | Client component with interactive state |
| `/config`  | Server-resolved app config and support email |
| `/items`   | CRUD form backed by the `/api/items` API |

## Getting started

```bash
npm install
npm run dev
```

App runs on http://localhost:3000.

## Test selectors

Every page and interactive element exposes a `data-testid` attribute for stable targeting:

- `nav-home`, `nav-about`, `nav-counter`, `nav-config`, `nav-items`
- `home-page`, `about-page`, `counter-page`, `config-page`, `items-page`
- `counter-value`, `counter-increment`, `counter-decrement`, `counter-reset`
- `item-form`, `item-input`, `item-description-input`, `item-add`, `item-list`

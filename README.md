# Awesome Testing

A production-ready **Playwright + TypeScript** starter template with multi-environment configuration, a fixture-driven Page Object Model, tag-based suites, CI workflows and Playwright MCP support for AI agents.

Out of the box it targets the public demo app [the-internet.herokuapp.com](https://the-internet.herokuapp.com) so every test passes on a fresh clone. Point `BASE_URL` at your own app to make it yours.

## Features

- **Zero-instantiate POM** — Page Objects are auto-injected via custom fixtures: `async ({ loginPage, dashboardPage }) => { ... }`.
- **Type-safe environments** — `local`, `dev`, `staging`, `prod` loaded from `config/.env.<env>` and validated with `zod`. Tests refuse to start if config is missing or malformed.
- **Headless by default, headed on demand** — no config edits, just `--headed` or the `*:headed` scripts.
- **Cross-platform scripts** via `cross-env` (Windows, macOS, Linux).
- **Tags** — `@smoke`, `@regression`, `@auth`.
- **Failure artifacts only** — trace, screenshot and video are kept only for failed tests.
- **CI** — GitHub Actions PR matrix (chromium, firefox, webkit, mobile) and a scheduled prod smoke run.
- **AI-ready** — `@playwright/mcp` configured for Claude Code (`.mcp.json`) and Cursor (`.cursor/mcp.json`), plus `CLAUDE.md` agent rules.

## Requirements

- Node.js **20+**

## Getting started

```bash
npm install
npx playwright install
cp config/.env.example config/.env.staging   # skip if the file already exists
npm test
```

## Scripts

| Script                                     | What it does                                   |
| ------------------------------------------ | ---------------------------------------------- |
| `npm test`                                 | All tests, default env (`staging`), headless   |
| `npm run test:local` / `test:local:headed` | Against `config/.env.local`                    |
| `npm run test:dev`                         | Against `config/.env.dev`, headless            |
| `npm run test:dev:headed`                  | Against `config/.env.dev`, visible browser     |
| `npm run test:staging`                     | Against `config/.env.staging`, headless        |
| `npm run test:staging:headed`              | Against `config/.env.staging`, visible browser |
| `npm run test:prod:smoke`                  | Only `@smoke` tests against `config/.env.prod` |
| `npm run test:smoke` / `test:regression`   | Filter by tag (current env)                    |
| `npm run test:ui`                          | Playwright UI mode                             |
| `npm run test:debug`                       | Playwright Inspector                           |
| `npm run report`                           | Open the last HTML report                      |
| `npm run codegen`                          | Record locators with Playwright codegen        |
| `npm run typecheck`                        | `tsc --noEmit` (strict)                        |
| `npm run lint` / `lint:fix`                | ESLint, zero warnings allowed                  |
| `npm run format` / `format:check`          | Prettier                                       |
| `npm run mcp`                              | Start the Playwright MCP server manually       |

Extra Playwright CLI flags can be passed after `--`:

```bash
npm run test:staging -- --project=chromium --grep "logs in"
```

## Environments

| Variable         | Required       | Description                                                 |
| ---------------- | -------------- | ----------------------------------------------------------- |
| `ENV`            | set by scripts | `local` \| `dev` \| `staging` \| `prod` (default `staging`) |
| `BASE_URL`       | yes            | App URL, used as Playwright `baseURL`                       |
| `API_URL`        | no             | API base URL for `apiHelper` (falls back to `BASE_URL`)     |
| `ADMIN_USERNAME` | yes            | Login user                                                  |
| `ADMIN_PASSWORD` | yes            | Login password                                              |

`config/.env.*` files are git-ignored except `.env.example`. Real environment variables (e.g. CI secrets) override the file when they are non-empty.

### CI configuration

Set these in **GitHub → Settings → Secrets and variables → Actions** to target your real app (otherwise the demo values from `.env.example` are used):

- Variables: `STAGING_BASE_URL`, `STAGING_API_URL`, `PROD_BASE_URL`, `PROD_API_URL`
- Secrets: `STAGING_ADMIN_USERNAME`, `STAGING_ADMIN_PASSWORD`, `PROD_ADMIN_USERNAME`, `PROD_ADMIN_PASSWORD`

## Project structure

```text
.cursor/mcp.json            MCP config for Cursor
.mcp.json                   MCP config for Claude Code
.github/workflows/          test-pr.yml, smoke-prod.yml
config/                     env.config.ts + .env.<env> files
src/fixtures/pageFixtures.ts  extended `test` with injected pages
src/pages/                  base.page.ts, login.page.ts, dashboard.page.ts
src/utils/                  logger.ts, apiHelper.ts
src/types/env.d.ts          ProcessEnv typings
tests/auth/login.spec.ts    auth flows (@auth @smoke @regression)
tests/smoke/healthCheck.spec.ts  fast health checks (@smoke)
```

## Writing a test

```ts
import { test } from '@fixtures/pageFixtures';

test('user logs in', { tag: ['@smoke', '@auth'] }, async ({ loginPage, dashboardPage, env }) => {
  await loginPage.goto();
  await loginPage.submitLoginForm(env.ADMIN_USERNAME, env.ADMIN_PASSWORD);
  await dashboardPage.assertIsVisible();
});
```

To add a page: create `src/pages/<name>.page.ts` extending `BasePage`, register it in `src/fixtures/pageFixtures.ts`, then request it by name in your spec. See [CLAUDE.md](CLAUDE.md) for the full conventions.

## Using Playwright MCP with Claude Code

`.mcp.json` registers the `playwright` MCP server. Open the project in Claude Code, approve the server, then ask e.g.:

> Open the staging app's /settings page with the Playwright MCP, read its accessibility tree, and create a SettingsPage object, fixture and @regression spec following CLAUDE.md.

## License

MIT

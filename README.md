# SauceDemo Test Automation - Greenbone Coding Challenge

This is my submission for the Greenbone Test Automation Engineer coding challenge. It's a UI automation project built on top of [SauceDemo](https://www.saucedemo.com) using Playwright and TypeScript.

The full breakdown of the 10 test cases, prioritization and the detailed TCMS case is in [TEST_CASES.md](./TEST_CASES.md).

---

## Why Playwright

Before picking a tool I thought about what the app actually needs. SauceDemo is a pure frontend, there's no public API to hit, no backend to mock, no integrations to verify. So the choice really came down to which UI framework is going to be the least painful to work with as the project grows.

I went with Playwright instead of Cypress. The short answer: I don't want to hit a wall later.

If at some point the suite needs to handle multiple tabs, validate something inside a cross-origin iframe, or run in parallel for free on CI, Playwright does all of that natively. Cypress has architectural limits around these areas that you can work around, but it's friction I'd rather not introduce. I'd rather pick the framework that doesn't fight me when the requirements grow.

On top of that:

- TypeScript works out of the box, no extra config gymnastics.
- Auto-waiting is reliable, so I don't need to litter the code with `waitForTimeout` calls.
- `test.step()` gives me a clean way to map automation back to the TCMS document.
- Cross-browser is just a config change, not a refactor.

## What I automated

The challenge asks for the top 3 priority tests, and that's what I focused on:

1. **TC-001** — `standard_user` can complete the full checkout flow end-to-end
2. **TC-002** — Total price on the overview page equals item total + tax
3. **TC-003** — `standard_user` logs in successfully with valid credentials

A few extra scenarios are included (negative login cases, multi-product checkouts, math with different cart sizes). I didn't add them to inflate coverage they were essentially "free" once the data-driven structure was in place, and they show how easy it is to extend.

---

## Project Structure

```
efecagatayercan_GreenBone/
├── pages/                  # Page Object classes
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/                  # Spec files
│   ├── login.spec.ts
│   └── checkout.spec.ts
├── data/                   # Test data lives here, never inside specs
│   ├── users.ts
│   ├── products.ts
│   ├── loginData.ts
│   └── checkoutData.ts
├── utils/
│   └── urls.ts
├── playwright.config.ts
├── tsconfig.json
├── TEST_CASES.md
└── README.md
```

The idea behind the layout is to keep each layer doing one thing:

- **`pages/`** hides selectors and exposes meaningful actions. The tests don't need to know which element is clicked to "add a product" they just call `inventoryPage.addProductToCart(...)`. If the markup changes, only the page class changes.
- **`data/`** is the single source of truth for everything that's not code: credentials, products, URLs, scenarios. Nothing is hardcoded inside specs. If a product ID changes tomorrow, I update one constant.
- **`tests/`** stays thin. Specs orchestrate page objects and assert outcomes, nothing more.
- **`utils/urls.ts`** centralizes URL/route patterns so route changes are a one-liner.

---

## Design Choices

### Page Object Model

Every page in the app has its own class, named after the page (`LoginPage`, `CartPage`, etc.). Each class owns its selectors and exposes high-level actions like `login`, `addProductToCart`, or `clickCheckout`. The point is to make tests read like a story and keep selector maintenance in one place.

### Data-driven structure

Instead of copy-pasting a test body for each variation, I drive the same flow with different data. `data/checkoutData.ts` and `data/loginData.ts` are arrays of scenario objects, and the spec just loops over them. To add a new case, I usually only touch the data file no spec changes, no new test method.

A side benefit: Playwright reports every iteration as its own test, so the report still shows them as separate cases.

### `test.step()` for traceability

Each step in the TCMS doc (TC-001 in particular) has a matching `test.step()` block in the spec. When someone opens the HTML report, they see the same steps as in the documentation  easy to map test execution back to the written test case, easy to spot which step failed.

### Selectors

I use SauceDemo's `data-test` attributes (`[data-test="username"]`, etc.) rather than CSS classes or IDs. `data-test` attributes are there specifically for testing they don't get reshuffled when someone refactors styles. This gives me the most stable hook into the DOM.

---

## Running the Project

### Requirements

- Node.js 18+
- npm

### Setup

```bash
git clone <repo-url>
cd efecagatayercan_GreenBone
npm install
npx playwright install
```

The `npx playwright install` step grabs the browser binaries only needed once.

### Running tests

```bash
npm test               # headless run
npm run test:headed    # see the browser while it runs
npm run test:ui        # Playwright UI mode, very handy for debugging
npm run report         # open the HTML report after a run
```

### Browser

Default is Chromium. Firefox and WebKit are easy to enable in `playwright.config.ts` if needed I left them off for this submission since the focus was on getting the structure right rather than running everything in three browsers.

---

## Contributing

If someone else on the team wants to add a test, the flow looks like this:

1. **Start with the data.** Open the right file under `data/` and add a new scenario object. Most of the time this is the only change needed.
2. **Reuse page objects.** Before adding a new method, check if an existing one already does what you need.
3. **If a new interaction is required**, add the method to the relevant page class. Keep it focused page objects do actions, they don't assert.
4. **Run locally** (`npm test`) before pushing.

### A few rules I tried to stick to

- No hardcoded values inside specs. Credentials, URLs, product IDs all from `data/` or `utils/`.
- No `waitForTimeout` calls. Playwright's auto-waiting and web-first assertions are enough in 99% of cases.
- Use `data-test` selectors whenever available.
- Wrap meaningful actions in `test.step()` so the report stays readable.
- Page objects don't make assertions. That's the spec's job.

---

## What I'd Add Next

Things that didn't fit in the scope of this task but would be the natural next steps:

- A GitHub Actions workflow that runs the suite on every PR, ideally across browsers in parallel.
- Visual regression with `toHaveScreenshot()` would catch what `problem_user` exposes nicely.
- Allure or another reporter for trend analysis over time.
- Move credentials to `.env` + a secret manager once tests run against a real environment.
- API-level tests as soon as there's a backend to hit UI shouldn't be the only layer.
- An accessibility pass with `@axe-core/playwright`.

---

## Files

- [`TEST_CASES.md`](./TEST_CASES.md)  All 10 test cases, prioritization with reasoning, the detailed TCMS case, and a few notes from exploratory testing.
- [`playwright.config.ts`](./playwright.config.ts)  Playwright configuration.

Perfect 👍 — let’s go **step-by-step** and build your full understanding of **Testing** and **Playwright**, from **basic to advanced**, with **simple explanations and examples**.

---

# 🧩 1. What Is Testing?

Testing means **checking if your code works correctly** — whether it gives the right output, handles errors, and performs as expected.

It’s used to:

* Find bugs early
* Ensure reliability when adding new features
* Automate quality checks

---

# 🧪 2. Types of Testing

### ✅ Unit Testing

Tests **individual functions or components**.

* Example: Testing if `add(2, 3)` returns `5`.

### 🧱 Integration Testing

Tests how **multiple parts** of the system work together.

* Example: Check if your backend API + database connection returns correct data.

### 💻 End-to-End (E2E) Testing

Simulates **real user behavior**.

* Example: A test opens your website, logs in, adds a product to cart, and checks if checkout works.

### 🧠 Regression Testing

After you change something, this ensures **old features still work**.

### ⚙️ Performance Testing

Checks speed, scalability, and stability under load.

---

# 🧰 3. Popular Testing Tools

| Type          | Tool                                  |
| ------------- | ------------------------------------- |
| Unit          | Jest, Mocha, Vitest                   |
| Integration   | Supertest, Cypress                    |
| E2E (Browser) | **Playwright**, **Cypress**, Selenium |

---

# 🎭 4. What Is Playwright?

**Playwright** is a testing framework by Microsoft that lets you:

* Automate **browser interactions**
* Run tests on **Chromium, Firefox, and WebKit**
* Do **headless testing** (no browser window)
* Use **real user flows** like clicking, typing, navigation

Think of Playwright as a **robot that uses your app like a human** and checks if everything works.

---

# ⚡ 5. Why Playwright?

✅ Cross-browser (Chrome, Firefox, Safari)
✅ Works for frontend + backend validation
✅ Supports screenshots, video recording
✅ Supports parallel execution (faster tests)
✅ Has test generator & debugging tools

---

# 🧱 6. Installing Playwright

Run:

```bash
npm init playwright@latest
```

Then select:

* “TypeScript” or “JavaScript”
* “E2E Testing”
* Browsers (Chrome, Firefox, WebKit)

To run tests:

```bash
npx playwright test
```

To view results:

```bash
npx playwright show-report
```

---

# 🧮 7. Basic Playwright Test Example

**File:** `tests/example.spec.js`

```js
const { test, expect } = require('@playwright/test');

test('homepage has title and links to docs', async ({ page }) => {
  // Step 1: Go to URL
  await page.goto('https://playwright.dev/');

  // Step 2: Check title
  await expect(page).toHaveTitle(/Playwright/);

  // Step 3: Click on "Get started"
  await page.click('text=Get started');

  // Step 4: Verify navigation
  await expect(page).toHaveURL(/.*docs/);
});
```

Run it:

```bash
npx playwright test
```

---

# 🧭 8. Playwright Test Structure

Each test has:

* `test()` — defines a single test case
* `expect()` — assertion/check
* `page` — browser page object to interact with

---

# ⚙️ 9. Advanced Selectors

Playwright supports **smart selectors**:

| Selector Type | Example                        | Meaning                         |
| ------------- | ------------------------------ | ------------------------------- |
| Text          | `'text=Login'`                 | Click element with “Login” text |
| CSS           | `'#username'`                  | By id                           |
| XPath         | `'//button[@type="submit"]'`   | By XPath                        |
| Role          | `'role=button[name="Submit"]'` | Accessibility-based             |
| Test ID       | `'[data-testid="login-btn"]'`  | Recommended for stable tests    |

---

# 🧩 10. Assertions with `expect()`

Examples:

```js
await expect(page).toHaveTitle('Dashboard');
await expect(page.locator('#welcome')).toHaveText('Hello Saleh');
await expect(page.locator('button')).toBeEnabled();
await expect(page).toHaveURL(/dashboard/);
```

---

# 💡 11. Handling Input & Actions

```js
await page.fill('#email', 'saleh@example.com');
await page.fill('#password', '123456');
await page.click('text=Login');
```

Wait for navigation:

```js
await page.waitForURL('/dashboard');
```

Take screenshot:

```js
await page.screenshot({ path: 'homepage.png' });
```

---

# 🧩 12. Fixtures & Hooks

Fixtures = reusable browser contexts
Hooks = run before/after tests

Example:

```js
test.beforeEach(async ({ page }) => {
  await page.goto('https://myapp.com');
});

test('login test', async ({ page }) => {
  await page.fill('#user', 'admin');
  await page.fill('#pass', 'admin123');
  await page.click('text=Login');
  await expect(page).toHaveURL('/dashboard');
});
```

---

# 🧪 13. Parallel Tests

Playwright runs tests in parallel by default:

* You can control it using config file: `playwright.config.js`

Example:

```js
module.exports = {
  workers: 4,  // number of parallel threads
  use: {
    headless: true,
  },
};
```

---

# 🧱 14. Page Object Model (POM)

To avoid repeating selectors everywhere, use **POM**.

**Example:**
`pages/LoginPage.js`

```js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = '#username';
    this.passwordInput = '#password';
    this.loginButton = 'text=Login';
  }

  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
}

module.exports = { LoginPage };
```

`tests/login.spec.js`

```js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('https://myapp.com');
  await loginPage.login('admin', 'password123');
  await expect(page).toHaveURL('/dashboard');
});
```

---

# 🎥 15. Screenshots & Videos (Debugging)

Enable in config:

```js
use: {
  screenshot: 'on',
  video: 'on-first-retry',
}
```

You can also record manually:

```js
await page.screenshot({ path: 'error.png', fullPage: true });
```

---

# 🔍 16. Debugging

Run with UI:

```bash
npx playwright test --ui
```

Run one test interactively:

```bash
npx playwright test tests/example.spec.js --debug
```

You can pause using:

```js
await page.pause();
```

---

# 🚀 17. CI/CD Integration

Playwright integrates easily with:

* **GitHub Actions**
* **Jenkins**
* **GitLab CI**

Example (GitHub Actions):

```yaml
name: Playwright Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install
      - run: npx playwright test
```

---

# 🧠 18. Advanced Topics

### 🌐 API Testing

Playwright can test APIs too!

```js
const { test, expect } = require('@playwright/test');

test('API should return users', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.length).toBeGreaterThan(0);
});
```

---

### 🧩 Component Testing (React, Next.js)

Playwright supports testing UI components directly (in dev servers).

Example:

```bash
npx playwright test --project=chromium --config=playwright.component.config.js
```

---

### 🧾 Visual Regression Testing

Compare screenshots over time to catch UI changes.

```js
await expect(page).toHaveScreenshot('homepage.png');
```

---

# 🧭 19. Real-world Folder Structure

```
tests/
  ├── example.spec.js
  ├── login.spec.js
  ├── dashboard.spec.js
pages/
  ├── LoginPage.js
  ├── DashboardPage.js
playwright.config.js
```

---

# 🧩 20. Summary

| Concept        | Description                     |
| -------------- | ------------------------------- |
| **Unit Test**  | Test single functions           |
| **E2E Test**   | Simulate user journey           |
| **Playwright** | Browser automation for testing  |
| **Fixtures**   | Pre-setup environment           |
| **POM**        | Clean test code structure       |
| **Reports**    | HTML report of test results     |
| **CI/CD**      | Run automatically on every push |

---

---

## ✅ Yes — using this is **perfect and recommended**:

```ts
await page.getByRole('link', { name: 'Sign In' }).click();
```

Let’s break it down clearly 👇

---

### 🧠 Why it works best

Playwright follows the **ARIA roles and accessibility tree** — just like how screen readers interpret your web page.
Your `Link` component renders as an `<a>` tag, so Playwright assigns it the **role = "link"**.

So:

```tsx
<Link to="/signin">Sign In</Link>
```

becomes something like:

```html
<a href="/signin">Sign In</a>
```

➡️ Which Playwright can find as:

```ts
page.getByRole('link', { name: 'Sign In' })
```

---

### 🧩 Alternative Selectors (for comparison)

| Type                          | Example                                  | When to Use                                   |
| ----------------------------- | ---------------------------------------- | --------------------------------------------- |
| **Role + Name (Recommended)** | `getByRole('link', { name: 'Sign In' })` | Most stable and readable                      |
| **Text**                      | `getByText('Sign In')`                   | When the role is not defined or not clickable |
| **Locator (CSS)**             | `locator('a[href="/signin"]')`           | When the link text may vary                   |
| **Test ID**                   | `getByTestId('signin-link')`             | When using `data-testid` for strict targeting |

---

### ✅ Example: Full Test Snippet

```ts
import { test, expect } from '@playwright/test';

test('should navigate to sign in page', async ({ page }) => {
  await page.goto('https://www.thecodedsa.live');

  // Click the Sign In button
  await page.getByRole('link', { name: 'Sign In' }).click();

  // Wait for navigation
  await expect(page).toHaveURL('https://www.thecodedsa.live/signin');

  // Optional: Check that the login form is visible
  await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
});
```

---

### 🧩 Bonus Tip

If your `Sign In` link is inside a mobile menu (like your `isMobile` logic),
you may need to:

```ts
await page.getByRole('button', { name: 'Menu' }).click();
await page.getByRole('link', { name: 'Sign In' }).click();
```

to first open the mobile menu before clicking the link.

---


## 🧠 What is `page` in Playwright?

In Playwright, `page` represents a **single browser tab** — just like a tab you open in Chrome or Edge.

So when you run:

```ts
await page.goto("https://www.thecodedsa.live");
```

➡️ You are literally telling Playwright:

> “Open this URL in a browser tab and control it programmatically.”

---

## 💡 Why we use `page` before `expect()`

This line:

```ts
await expect(page).toHaveURL("https://www.thecodedsa.live");
```

means:

> ✅ “I expect the current tab (page) to be showing this exact URL.”

---

## 🔍 How it works

* `page` — refers to the browser tab currently being tested.
* `expect(page)` — creates an assertion **on the entire page** (not just an element).
* `.toHaveURL("...")` — checks the **current address bar URL**.

So Playwright checks:

> “Is the page’s current URL equal to `https://www.thecodedsa.live`?”

If yes ✅ → test passes.
If not ❌ → it throws an error like the one you saw earlier.

---

## ⚙️ Example in context

```ts
import { test, expect } from "@playwright/test";

test("login redirects to homepage", async ({ page }) => {
  // 1. Open the site
  await page.goto("https://www.thecodedsa.live/signin");

  // 2. Fill credentials
  await page.getByPlaceholder("Enter your email").fill("saleh@thecodedsa.live");
  await page.getByPlaceholder("••••••••").fill("Saleh@2025");

  // 3. Click login
  await page.getByRole("button", { name: "Sign In" }).click();

  // 4. Wait for navigation
  await expect(page).toHaveURL("https://www.thecodedsa.live");
});
```

Here:

* `page.goto()` → opens a tab
* `page.getBy...()` → finds elements inside that tab
* `expect(page).toHaveURL()` → checks the tab’s URL after login

---

## 🧩 Bonus: There are other expect targets too

| Assertion                                          | What it checks    |
| -------------------------------------------------- | ----------------- |
| `expect(page).toHaveTitle('Home')`                 | Page title        |
| `expect(page.locator('h1')).toHaveText('Welcome')` | Element text      |
| `expect(page.getByRole('button')).toBeVisible()`   | Visibility        |
| `expect(page).toHaveURL(/dashboard/)`              | URL matches regex |

---

### ⚠️ Common Mistake

If your app takes time to redirect after login, Playwright might check the URL **too early**.

So, you can increase timeout:

```ts
await expect(page).toHaveURL("https://www.thecodedsa.live", { timeout: 10000 });
```

Or use:

```ts
await page.waitForURL("**/dashboard");
```

---

Ah! This error is **classic “strict mode violation”** in Playwright. Let me explain carefully and show how to fix it.

---

# ❌ Error Explanation

```
locator.click: strict mode violation: getByRole('link', { name: 'Sign In' }) resolved to 2 elements
```

* You have **two links** with almost the same text on the page:

  1. `<a href="/signin" class="btn ...">Sign In</a>`
  2. `<a href="/signin" class="text-blue-400 underline">sign in</a>`

* By default, Playwright **strict mode** expects **exactly one element** for a locator.

* Since it found **two**, it throws an error.

---

# ✅ How to Fix

You have multiple options:

---

## 1️⃣ Use `exact: true`

This tells Playwright to match **exact text**, including case:

```ts
await page.getByRole('link', { name: 'Sign In', exact: true }).click();
```

* Matches **exactly "Sign In"** (not "sign in").

---

## 2️⃣ Use `first()` or `nth()` if you want the first match

```ts
await page.getByRole('link', { name: 'Sign In' }).first().click();
```

* Grabs the **first element** Playwright finds.
* Useful if duplicates exist but only the first one matters.

---

## 3️⃣ Use a more **specific locator** (recommended for stability)

* Add a **class or parent container**:

```ts
// Target the button style link
await page.locator('a.btn', { hasText: 'Sign In' }).click();
```

* This ensures only the main **Sign In button** is clicked, ignoring small text links.

---

## 4️⃣ Use `getByText` with exact

```ts
await page.getByText('Sign In', { exact: true }).click();
```

* Works if role detection is ambiguous.

---

## 🧩 Recommended Fix for Your Case

Since you have:

```tsx
<Link
  to="/signin"
  className="btn ..."
>
  Sign In
</Link>
```

The cleanest way is:

```ts
await page.getByRole('link', { name: 'Sign In', exact: true }).click();
```

Or, if you want to be extra safe:

```ts
await page.locator('a.btn', { hasText: 'Sign In' }).click();
```

---

### ✅ Updated Full Snippet

```ts
import { test, expect } from '@playwright/test';

test('Sign In navigation', async ({ page }) => {
  await page.goto('https://thecodedsa.live');

  // Click the main Sign In button
  await page.getByRole('link', { name: 'Sign In', exact: true }).click();

  // Fill the login form
  await page.getByPlaceholder('you@example.com').fill('saleh@gmail.com');
  await page.getByPlaceholder('••••••••').fill('Saleh@2025');

  // Submit
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Verify navigation
  await expect(page).toHaveURL(/thecodedsa\.live/);
});
```

---



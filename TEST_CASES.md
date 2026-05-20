# Test Cases & Strategy - SauceDemo

## 1. Exploratory Testing & Strategy

Before writing any test cases, I spent some time exploring the SauceDemo application manually. I checked the network calls in DevTools, looked for visual or UI issues, and tried each of the user personas the site provides to see how they behave differently.

Instead of going straight to edge cases or the obvious bugs that come with users like `problem_user`, I wanted to make sure the core flow works first. For an e-commerce app, that means login, cart, and checkout. So my automation focuses on the happy path with `standard_user` and the form validations that protect the checkout step. Edge cases can come later once the main flow is covered.

## 2. Test Cases

Listed below in priority order (highest to lowest):

| # | Test Case | Priority |
|---|-----------|----------|
| 1 | `standard_user` can complete the full checkout flow end-to-end (happy path) | P0 |
| 2 | Total price on the overview page is correct (Item Total + Tax = Total) | P0 |
| 3 | `standard_user` can log in with valid credentials | P0 |
| 4 | `locked_out_user` sees the locked-out error message when trying to log in | P1 |
| 5 | Invalid password shows the correct error message | P1 |
| 6 | Checkout blocks the user and shows an error when "First Name" is empty | P1 |
| 7 | Checkout blocks the user and shows an error when "Zip/Postal Code" is empty | P1 |
| 8 | Cart badge updates correctly when items are added | P2 |
| 9 | An item added to the cart can be removed | P2 |
| 10 | Product sorting (e.g. Price: Low to High) reorders the list correctly | P3 |

### Why this order

I grouped the tests by how much damage they would cause if they failed in production:

- **P0** covers anything that touches money or blocks access. If checkout breaks or the total is wrong, the business loses revenue and trust immediately. Login is in here too because if users can't get in, nothing else matters.
- **P1** covers things that block users but don't directly break the money flow. A locked-out user with the wrong message is confusing; empty fields in checkout that get accepted can cause bad order data downstream.
- **P2** is for cart interactions. Important, but most users would notice and retry if something looked off.
- **P3** is for sorting. Useful, but it doesn't stop anyone from buying.

## 3. Detailed Test Case (TCMS Format)

**Test ID:** TC-001
**Title:** Standard user can complete the end-to-end checkout flow
**Priority:** P0 (Critical)
**Type:** Functional / E2E
**Module:** Checkout

**Description:**
Verifies that a standard user can add a product to the cart, fill in shipping details, and finish the purchase without any interruption. Login is covered separately by TC-003 and treated as a pre-condition here.

**Pre-conditions:**
- The app is reachable at `https://www.saucedemo.com`
- `standard_user` is logged in (handled in test setup, covered separately by TC-003)
- Browser starts in a clean state (no cookies / localStorage from previous sessions)

**Test Data:**
| Field | Value |
|-------|-------|
| Username | `standard_user` |
| Password | `secret_sauce` |
| First Name | `Efe` |
| Last Name | `Ercan` |
| Postal Code | `34000` |

**Test Steps:**

| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click "Add to cart" on "Sauce Labs Backpack" | Button changes to "Remove", cart badge shows `1` |
| 2 | Click the cart icon (top right) | Redirected to `/cart.html`, the backpack is listed |
| 3 | Click Checkout | `/checkout-step-one.html` opens with empty form fields |
| 4 | Fill in First Name, Last Name, Postal Code with the test data above, then click Continue | `/checkout-step-two.html` opens with the order summary |
| 5 | Verify the price math: Item Total + Tax = Total | The numbers add up correctly |
| 6 | Click Finish | `/checkout-complete.html` opens with "Thank you for your order!" message |

**Expected Final Result:**
The user reaches the order confirmation page, the success message is shown, and the cart badge is cleared.

**Post-conditions:**
- User is still logged in
- Cart is empty

**Traceability:**
Each step above maps to a `test.step()` block in `tests/checkout.spec.ts`, so each TCMS step is visible as a separate entry in the Playwright HTML report.

---

## Notes from Exploratory Testing

A few things I noticed while exploring the app that are outside the automation scope but worth mentioning:

- The postal code field on checkout accepts anything no length or format validation. You can put `abc` or a 50-digit number and it goes through. Likely needs a numeric and length constraint.
- `problem_user` shows mismatched product images on the inventory page. This looks like an intentional bug placed by the SauceDemo team for testing visual regression scenarios.

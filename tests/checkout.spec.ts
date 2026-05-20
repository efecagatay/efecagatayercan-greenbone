import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { checkoutScenarios, priceMathScenarios, defaultShippingInfo } from '../data/checkoutData';
import { URLS } from '../utils/urls';
import { USERS } from '../data/users';

test.describe('Checkout - End to End', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await loginPage.goto();
        await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    });

    for (const scenario of checkoutScenarios) {
        test(`E2E happy path - ${scenario.description}`, async ({ page }) => {

            await test.step('Add products to cart and verify badge count', async () => {
                await inventoryPage.addProductsToCart(scenario.products);
                expect(await inventoryPage.getCartBadgeCount()).toBe(scenario.products.length);
                for (const productId of scenario.products) {
                    expect(await inventoryPage.isProductInCart(productId)).toBe(true);
                }
            });

            await test.step('Open cart page and verify items', async () => {
                await inventoryPage.openCart();
                await expect(page).toHaveURL(URLS.CART);
                expect(await cartPage.getItemCount()).toBe(scenario.products.length);
            });

            await test.step('Proceed to checkout step one', async () => {
                await cartPage.clickCheckout();
                await expect(page).toHaveURL(URLS.CHECKOUT_STEP_ONE);
            });

            await test.step('Fill shipping info and continue to overview', async () => {
                const { firstName, lastName, postalCode } = scenario.shippingInfo;
                await checkoutPage.fillShippingInfo(firstName, lastName, postalCode);
                await expect(page).toHaveURL(URLS.CHECKOUT_STEP_TWO);
            });

            await test.step('Verify price math on overview page (subtotal + tax = total)', async () => {
                const subtotal = await checkoutPage.getSubtotal();
                const tax = await checkoutPage.getTax();
                const total = await checkoutPage.getTotal();
                expect(total).toBeCloseTo(subtotal + tax, 2);
            });

            await test.step('Finish order and verify success page', async () => {
                await checkoutPage.clickFinish();
                await expect(page).toHaveURL(URLS.CHECKOUT_COMPLETE);
                await expect(checkoutPage.completeHeader).toHaveText(scenario.expectedCompleteHeader);
                await expect(inventoryPage.cartBadge).not.toBeVisible();
            });
        });
    }

    for (const scenario of priceMathScenarios) {
        test(scenario.description, async () => {

            await test.step('Add products and proceed to checkout overview', async () => {
                await inventoryPage.addProductsToCart(scenario.products);
                await inventoryPage.openCart();
                await cartPage.clickCheckout();

                const { firstName, lastName, postalCode } = defaultShippingInfo;
                await checkoutPage.fillShippingInfo(firstName, lastName, postalCode);
            });

            await test.step('Verify total equals subtotal plus tax', async () => {
                const subtotal = await checkoutPage.getSubtotal();
                const tax = await checkoutPage.getTax();
                const total = await checkoutPage.getTotal();
                expect(total).toBeCloseTo(subtotal + tax, 2);
            });
        });
    }
});
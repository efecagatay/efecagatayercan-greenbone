import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginScenarios } from '../data/loginData';

test.describe('Login - Data Driven', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    for (const scenario of loginScenarios) {
        test(scenario.description, async ({ page }) => {

            await test.step(`Submit login with username "${scenario.username}"`, async () => {
                await loginPage.login(scenario.username, scenario.password);
            });

            if (scenario.shouldLogin) {
                await test.step('Verify user is redirected to inventory page', async () => {
                    await expect(page).toHaveURL(scenario.expectedUrlPattern!);
                });
            } else {
                await test.step('Verify expected error message is displayed', async () => {
                    const error = await loginPage.getErrorMessage();
                    expect(error).toContain(scenario.expectedError!);
                });
            }
        });
    }
});
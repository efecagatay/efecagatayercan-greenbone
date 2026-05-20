import { Page, Locator } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly inventoryItems: Locator;
    readonly cartLink: Locator;
    readonly cartBadge: Locator;
    readonly sortDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.locator('[data-test="title"]');
        this.inventoryItems = page.locator('[data-test="inventory-item"]');
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    }

    async addProductToCart(productId: string) {
        await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
    }

    async addProductsToCart(productIds: string[]) {
        for (const id of productIds) {
            await this.addProductToCart(id);
        }
    }

    async openCart() {
        await this.cartLink.click();
    }

    async getCartBadgeCount(): Promise<number> {
        const text = await this.cartBadge.textContent();
        return text ? parseInt(text, 10) : 0;
    }

    async isProductInCart(productId: string): Promise<boolean> {
    return await this.page.locator(`[data-test="remove-${productId}"]`).isVisible();
}
}
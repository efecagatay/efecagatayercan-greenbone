import { PRODUCTS } from './products';

export interface ShippingInfo {
    firstName: string;
    lastName: string;
    postalCode: string;
}

export interface CheckoutScenario {
    description: string;
    products: string[];
    shippingInfo: ShippingInfo;
    expectedCompleteHeader: string;
}

export const defaultShippingInfo: ShippingInfo = {
    firstName: 'Efe',
    lastName: 'Ercan',
    postalCode: '34000',
};

export const checkoutScenarios: CheckoutScenario[] = [
    {
        description: 'single product checkout',
        products: [PRODUCTS.BACKPACK],
        shippingInfo: defaultShippingInfo,
        expectedCompleteHeader: 'Thank you for your order!',
    },
    {
        description: 'multiple products checkout',
        products: [
            PRODUCTS.BACKPACK,
            PRODUCTS.BIKE_LIGHT,
            PRODUCTS.BOLT_TSHIRT,
        ],
        shippingInfo: defaultShippingInfo,
        expectedCompleteHeader: 'Thank you for your order!',
    },
];

export const priceMathScenarios: { description: string; products: string[] }[] = [
    {
        description: 'price math with 1 product',
        products: [PRODUCTS.BACKPACK],
    },
    {
        description: 'price math with 3 products',
        products: [
            PRODUCTS.BACKPACK,
            PRODUCTS.BIKE_LIGHT,
            PRODUCTS.BOLT_TSHIRT,
        ],
    },
    {
        description: 'price math with all 6 products',
        products: [
            PRODUCTS.BACKPACK,
            PRODUCTS.BIKE_LIGHT,
            PRODUCTS.BOLT_TSHIRT,
            PRODUCTS.FLEECE_JACKET,
            PRODUCTS.ONESIE,
            PRODUCTS.ALL_THE_THINGS,
        ],
    },
];
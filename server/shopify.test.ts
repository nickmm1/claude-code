import { describe, expect, it } from "vitest";

const SHOP = "mirabellacoaching.myshopify.com";

describe("Shopify API Credentials", () => {
  it("SHOPIFY_ACCESS_TOKEN is set", () => {
    const token = process.env.SHOPIFY_ACCESS_TOKEN;
    expect(token).toBeDefined();
    expect(token!.length).toBeGreaterThan(10);
  });

  it("SHOPIFY_WEBHOOK_SECRET is set", () => {
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    expect(secret).toBeDefined();
    expect(secret!.length).toBeGreaterThan(10);
  });

  it("Shopify API token can access the shop", async () => {
    const token = process.env.SHOPIFY_ACCESS_TOKEN;
    const response = await fetch(`https://${SHOP}/admin/api/2024-01/shop.json`, {
      headers: {
        "X-Shopify-Access-Token": token!,
        "Content-Type": "application/json",
      },
    });
    expect(response.status).toBe(200);
    const data = await response.json() as { shop: { name: string; email: string } };
    expect(data.shop).toBeDefined();
    expect(data.shop.name).toBeDefined();
    console.log(`Connected to Shopify store: ${data.shop.name} (${data.shop.email})`);
  });

  it("Shopify API can read orders and find product 8389644943526", async () => {
    const token = process.env.SHOPIFY_ACCESS_TOKEN;
    const PRODUCT_ID = "8389644943526";
    const response = await fetch(
      `https://${SHOP}/admin/api/2024-01/products/${PRODUCT_ID}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": token!,
          "Content-Type": "application/json",
        },
      }
    );
    expect(response.status).toBe(200);
    const data = await response.json() as { product: { id: number; title: string } };
    expect(data.product).toBeDefined();
    console.log(`Found coaching product: ${data.product.title} (ID: ${data.product.id})`);
  });
});

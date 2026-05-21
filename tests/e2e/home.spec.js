const { test, expect } = require("@playwright/test");

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Application error");
});

test("shop page renders", async ({ page }) => {
  await page.goto("/shop-default-grid");
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Application error");
});

test("checkout page renders", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Application error");
});

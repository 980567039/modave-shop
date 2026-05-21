const { defineConfig, devices } = require("@playwright/test");

const port = process.env.PORT || 5100;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;

module.exports = defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `pnpm dev:modave`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      ...process.env,
      PORT: String(port),
      TEMPLATE_ID: process.env.TEMPLATE_ID || "modave",
      NEXT_PUBLIC_ACTIVE_TEMPLATE:
        process.env.NEXT_PUBLIC_ACTIVE_TEMPLATE || "modave",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

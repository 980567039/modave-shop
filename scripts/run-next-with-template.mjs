#!/usr/bin/env node

import { spawn } from "node:child_process";

const command = process.argv[2];
const templateId =
  process.argv[3] ||
  process.env.TEMPLATE_ID ||
  process.env.NEXT_PUBLIC_ACTIVE_TEMPLATE ||
  "modave";
const port = process.env.PORT || "5100";

const commandMap = {
  dev: ["exec", "next", "dev", "-p", port],
  build: ["exec", "next", "build"],
  start: ["exec", "next", "start", "-p", port],
};

const args = commandMap[command];

if (!args) {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

const child = spawn("pnpm", args, {
  stdio: "inherit",
  env: {
    ...process.env,
    TEMPLATE_ID: templateId,
    NEXT_PUBLIC_ACTIVE_TEMPLATE: templateId,
  },
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

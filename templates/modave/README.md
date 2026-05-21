# Modave Template

This repository ships the Modave storefront with one maintained homepage variant.

## Homepage Variant

- `home-1`: API-driven storefront homepage.

Variant files live in:

```text
templates/modave/home-variants/home-1/
```

The registry is fixed to `home-1` so the app has one predictable homepage implementation and one production build command.

## Commands

```bash
pnpm dev
pnpm build
pnpm start
```

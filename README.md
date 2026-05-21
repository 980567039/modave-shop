# Modave Shop

A Next.js storefront using the Modave template with a single maintained homepage variant: `home-1`.

## Demo

[View live demo](https://nuvie-backup-main1.vercel.app/)

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

The default scripts are fixed to the Modave template:

- `pnpm dev` starts the Modave storefront locally.
- `pnpm build` builds the Modave storefront for production.
- `pnpm start` starts the production build.

## Vercel

Use the default Vercel Next.js settings with:

- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Output Directory: leave empty

Copy `.env.example` to configure production environment variables in Vercel.

## Homepage

Only one homepage variant is included:

- `templates/modave/home-variants/home-1`

The variant registry is intentionally fixed to `home-1` to keep this repository lightweight.

# Classics News Web Frontend

This project is a Nuxt 3 application that displays articles from the ZZSZ‑YCT "Classics" database. It uses Vuetify for UI components and Pinia for state management. Articles are written in Markdown and rendered with KaTeX support for mathematical notation.

## Features

- Dynamic background images pulled from the internet
- Article list with lazy loading and detail pages
- Markdown rendering with image sizing and KaTeX
- Login via Casdoor with cookie-based tokens
- Custom 404 page

## Getting Started

Install dependencies using your favourite package manager:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

To start a development server on `http://localhost:3000` run:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build and preview the production bundle:

```bash
# npm
npm run build
npm run preview

# pnpm
pnpm build
pnpm preview

# yarn
yarn build
yarn preview

# bun
bun run build
bun run preview
```

The application expects a backend API defined in `nuxt.config.ts` via `runtimeConfig.public.apiUrl`. The default value points to `https://classics-api.shittim.art/`.

## Project Structure

- `components/` – reusable Vue components
- `pages/` – Nuxt route components
- `stores/` – Pinia stores for articles and user state
- `utils/` – helper functions including the Markdown renderer

## License

This project is licensed under the terms of the GNU General Public License v3.

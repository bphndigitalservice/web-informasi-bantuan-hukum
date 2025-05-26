import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import compressor from "astro-compressor";


import react from "@astrojs/react";

import vercel from "@astrojs/vercel";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  // https://docs.astro.build/en/guides/images/#authorizing-remote-images
  site: "https://bantuanhukum.bphn.go.id",

  image: {
    domains: ["images.unsplash.com"],
  },

  i18n: {
    defaultLocale: "id",
    locales: ["id", "en"],
    fallback: {
      en: "id",
    },
    routing: {
      prefixDefaultLocale: false,
    },
  },

  prefetch: true,

  integrations: [sitemap({
    i18n: {
      defaultLocale: "id", // All urls that don't contain `en` after `https://screwfast.uk/` will be treated as default locale, i.e. `en`
      locales: {
        en: "en", // The `defaultLocale` value must present in `locales` keys
        id: "id",
      },
    },
  }), react(), partytown()],

  experimental: {
    clientPrerender: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://shiki.style/themes
      theme: 'dracula',
      // Alternatively, provide multiple themes
      // See note below for using dual light/dark themes
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // Disable the default colors
      // https://shiki.style/guide/dual-themes#without-default-color
      // (Added in v4.12.0)
      defaultColor: false,
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://shiki.style/languages
      langs: [],
      // Add custom aliases for languages
      // Map an alias to a Shiki language ID: https://shiki.style/languages#bundled-languages
      // https://shiki.style/guide/load-lang#custom-language-aliases
      langAlias: {
        cjs: "javascript"
      },
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
      // Add custom transformers: https://shiki.style/guide/transformers
      // Find common transformers: https://shiki.style/packages/transformers
      transformers: [],
    },
  },
});

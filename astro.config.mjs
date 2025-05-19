import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import starlight from "@astrojs/starlight";

import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

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
  }), react()],
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

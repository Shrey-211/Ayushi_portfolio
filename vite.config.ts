// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig as defineViteConfig } from "vite";
import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";

let config;

if (process.env.VERCEL) {
  config = defineViteConfig({
    build: {
      outDir: "dist",
    },
  });
} else {
  config = defineLovableConfig({
    tanstackStart: {
      server: {
        entry: "server",
      },
    },
  });
}

export default config;


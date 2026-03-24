import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(() => {
  const isVisualize = process.env.VISUALIZE === "1";
  return {
    plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    isVisualize &&
      visualizer({
        filename: "dist/bundle-report.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            tanstack: [
              "@tanstack/react-query",
              "@tanstack/query-core",
              "@tanstack/react-router",
              "@tanstack/router-core",
              "@tanstack/react-table",
            ],
            radix: [
              "@radix-ui/react-alert-dialog",
              "@radix-ui/react-avatar",
              "@radix-ui/react-checkbox",
              "@radix-ui/react-collapsible",
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-icons",
              "@radix-ui/react-label",
              "@radix-ui/react-popover",
              "@radix-ui/react-radio-group",
              "@radix-ui/react-scroll-area",
              "@radix-ui/react-select",
              "@radix-ui/react-separator",
              "@radix-ui/react-slot",
              "@radix-ui/react-switch",
              "@radix-ui/react-tabs",
              "@radix-ui/react-tooltip",
            ],
            date: ["react-day-picker", "date-fns"],
            ui: [
              "lucide-react",
              "@tabler/icons-react",
              "sonner",
              "react-top-loading-bar",
              "cmdk",
              "input-otp",
            ],
          },
        },
      },
    },
    server: {
      host: true,
      port: 8000,
      warmup: {
        clientFiles: [
          "./index.html",
          "./src/main.tsx",
          "./src/routeTree.gen.ts",
          "./src/routes/__root.tsx",
          "./src/routes/(auth)/sign-in.tsx",
          "./src/routes/_authenticated/index.tsx",
        ],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),

        // fix loading all icon chunks in dev mode
        // https://github.com/tabler/tabler-icons/issues/1233
        "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
      },
    },
  };
});

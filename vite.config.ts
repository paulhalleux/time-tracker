import react from "@vitejs/plugin-react";
import { defineConfig, type PluginOption } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), i18nHotReload()],
});

function i18nHotReload(): PluginOption {
  return {
    name: "i18n-hot-reload",
    handleHotUpdate({ file, server }) {
      if (file.includes("locales") && file.endsWith(".json")) {
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
}

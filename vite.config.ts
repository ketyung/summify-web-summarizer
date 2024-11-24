import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/popup.html", // Source HTML file
          dest: ".", // Copy it to the root of the output folder
          transform: (content) => {
            // Replace popup.tsx with popup.js
            return content.toString().replace('src="./popup.tsx"', 'src="./popup.js"');
          },
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: "./src/popup.html", // Entry for the popup
        background: "./src/background.ts", // Entry for the background script
        content: "./src/content.ts", // Entry for the content script
      },
      output: {
        entryFileNames: "[name].js", // Use clear output filenames
      },
    },
    outDir: "dist", // Output directory for the extension files
  },
});
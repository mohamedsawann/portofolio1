import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Same logo used for the BootScreen intro; we serve it dynamically in production.
const PSP_LOGO_FILE = path.resolve(
  __dirname,
  "..",
  "..",
  ".cursor",
  "projects",
  "Users-m7mdsawan-Downloads-handheld-portfolio",
  "assets",
  "ChatGPT_Image_Mar_30__2026_at_11_21_24_PM-d1dc89b1-c9bf-4087-b1de-d33a7b386785.png",
);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("/__psp__/logo.png", (_req, res) => {
    try {
      const buf = fs.readFileSync(PSP_LOGO_FILE);
      res.setHeader("Content-Type", "image/png");
      res.end(buf);
    } catch {
      res.status(404).send("Logo not found");
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

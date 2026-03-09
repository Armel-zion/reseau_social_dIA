import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// Simulation de base de données (en mémoire)
// À REMPLACER : Connecter une vraie base de données ici (MongoDB, PostgreSQL, etc.)
import { db } from "./server/db/index.ts";

// Routes
import authRoutes from "./server/routes/auth.ts";
import postRoutes from "./server/routes/posts.ts";
import aiRoutes from "./server/routes/ai.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/ai", aiRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

startServer();

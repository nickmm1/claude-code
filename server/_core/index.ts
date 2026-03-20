import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { analyzeHandler } from "../analyze";
import { shopifyWebhookHandler } from "../shopify-webhook";
import { memberLookupHandler, registerHandler } from "../member-lookup";
import { verifyAccessCodeHandler, checkSessionHandler, requireAccessSession, logoutHandler } from "../access-auth";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Cookie parser for session management
  app.use(cookieParser());
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Access code verification -- issues a session cookie (no auth required)
  app.post("/api/auth/verify-code", express.json(), verifyAccessCodeHandler);
  // Session status check -- frontend calls this on load to restore session
  app.get("/api/auth/session", checkSessionHandler);
  // Logout -- deletes session from DB and clears cookie
  app.post("/api/auth/logout", logoutHandler);

  // AI Accountant analysis endpoint -- requires valid session
  app.post("/api/analyze", requireAccessSession, ...analyzeHandler);

  // Shopify webhook - must use raw body for HMAC verification
  app.post("/api/shopify/webhook", express.raw({ type: "application/json" }), shopifyWebhookHandler);

  // Member lookup and registration
  app.get("/api/member-lookup", memberLookupHandler);
  app.post("/api/register", express.json(), registerHandler);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

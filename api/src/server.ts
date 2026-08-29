import app from "./app.js";
import { PORT } from "./config/env.config.js";
import { prisma } from "./lib/prisma.js";

const port = PORT;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/**
 * Gracefully shuts down the server by finishing active requests,
 * disconnecting Prisma, and then exiting the process.
 */
const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down gracefully...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  // Safety net: force-exit if shutdown hangs.
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

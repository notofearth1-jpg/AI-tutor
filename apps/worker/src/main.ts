import { NestFactory } from "@nestjs/core";
import { WorkerModule } from "./worker.module";

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(WorkerModule);
    await app.init();
    console.log("🚀 AI Worker is running and listening for jobs...");

    // Keep process alive indefinitely with an active heartbeat
    setInterval(() => {
      // No-op to keep event loop occupied
    }, 1000 * 60 * 60);

    return app;
  } catch (error) {
    console.error("❌ Fatal error starting AI Worker:", error);
    process.exit(1);
  }
}

// Ensure the bootstrap process is properly initialized
bootstrap().catch((err) => {
  console.error("💥 Unhandled error in bootstrap:", err);
  process.exit(1);
});

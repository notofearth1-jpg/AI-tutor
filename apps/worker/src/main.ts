import { NestFactory } from "@nestjs/core";
import { WorkerModule } from "./worker.module";

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(WorkerModule);
    await app.init();
    console.log("🚀 AI Worker is running and listening for jobs...");

    // Keep process alive indefinitely in all environments
    return new Promise(() => {
      /* This promise will never resolve, keeping the process alive */
    });
  } catch (error) {
    console.error("❌ Fatal error starting AI Worker:", error);
    process.exit(1);
  }
}
bootstrap();

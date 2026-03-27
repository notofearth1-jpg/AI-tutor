import { NestFactory } from "@nestjs/core";
import { WorkerModule } from "./worker.module";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  console.log("🚀 AI Worker is running and listening for jobs...");

  // Keep process alive indefinitely
  process.stdin.resume();
}
bootstrap();

import { Global, Module } from "@nestjs/common";

@Global()
@Module({})
export class LoggingModule {}
// In a real project, we would setup Winston or Pino here

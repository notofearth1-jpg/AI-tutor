import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser = require("cookie-parser"); // Re-pushed with require syntax to fix TS2349 in CommonJS build
import { env } from "@ai-tutor/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS
  const allowedOrigins = env.CORS_ALLOWED_ORIGINS 
    ? env.CORS_ALLOWED_ORIGINS.split(",").map((o: string) => o.trim())
    : ["http://localhost:3000", "https://ai-tutor-web-omega.vercel.app"];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("AI Tutor Platform API")
    .setDescription("The core API for the AI-powered personalized tutor platform.")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || env.PORT_API || 4000;
  await app.listen(port);
  
  const publicUrl = env.NEXT_PUBLIC_API_BASE_URL || `http://localhost:${port}`;
  console.log(`🚀 API is running on: ${publicUrl}/api`);
}
bootstrap();

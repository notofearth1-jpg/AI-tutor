import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { env } from "@ai-tutor/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS
  app.enableCors({
    origin: ["http://localhost:3000", "https://your-web-app.com"],
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
  console.log(`🚀 API is running on: http://localhost:${port}/api`);
}
bootstrap();

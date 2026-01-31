import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { LoggerService } from "./core/logger/logger-service";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // CRITICAL: Enables automatic type transformation
      transformOptions: {
        enableImplicitConversion: true, // Helps with query params
      },
      whitelist: true,
      forbidNonWhitelisted: false, // Set to false for query params
    }),
  );
  app.useLogger(app.get(LoggerService));
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { Logger, ValidationPipe } from "@nestjs/common";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.use(helmet());
  app.setGlobalPrefix("api/v1");
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
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch((error) => {
  Logger.error("error starting the server " + error);
});

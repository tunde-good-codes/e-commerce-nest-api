import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import helmet from "helmet";
import { LoggerService } from "src/core/logger/logger-service";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;
  let server: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(helmet());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // weed away or does'nt allow ppt  not in payloadF
      }),
    );
    app.useLogger(app.get(LoggerService));

    await app.init();
    server = app.getHttpServer();
  });

  it("/ (GET)", () => {
    return request(server).get("/").expect(200).expect("Hello World!");
  });
});

import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";
import { CoreModule } from "./core/core.module";
import { LoggerService } from "./core/logger/logger-service";
import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { DatabaseService } from "./database/prisma.service";
import { CacheService } from "./core/cache/cache.service";
import { mockDeep } from "jest-mock-extended";
describe("AppService", () => {
  let appService: AppService;
  let cacheService: DeepMocked<CacheService>;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: LoggerService,
          useValue: createMock<LoggerService>(),
        },
        {
          provide: DatabaseService,
          useValue: mockDeep<DatabaseService>(),
        },
        {
          provide: CacheService,
          useValue: createMock<CacheService>(),
        },
      ],
      imports: [CoreModule],
    }).compile();

    appService = app.get<AppService>(AppService);
    cacheService = app.get(CacheService);
  });

  describe("root", () => {
    it('should return "Hello World!"', async () => {
      cacheService.get.mockResolvedValue("red");
      const result = await appService.getHello();
      expect(result).toBe("red");
    });
  });
});

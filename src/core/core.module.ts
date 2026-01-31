import { Global, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import config from "../config";
import { TransformResponseInterceptor } from "./interceptors/transform-response/transform-response.interceptor";
import { LoggerService } from "./logger/logger-service";
import { LoggerMiddleware } from "./middleware/logger/logger.middleware";
import { PrismaService } from "../database/prisma.service";
import { CacheService } from "./cache/cache.service";
import { RedisModule } from "./redis/redis.module";
import { DatabaseModule } from "src/database/databse.module";
import { UrlModule } from "src/modules/url/url.module";
import { UidModule } from "src/services/uid/uid.module";
import { QueueModule } from "./queue/queue.module";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    RedisModule,
    DatabaseModule,

    UrlModule,
    UidModule,
    QueueModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    LoggerService,
    PrismaService,
    CacheService,
  ],
  exports: [LoggerService, PrismaService, CacheService],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}

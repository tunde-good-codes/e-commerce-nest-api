/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ExpressAdapter } from "@bull-board/express";
import { BullBoardModule } from "@bull-board/nestjs";

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const username = configService.get("redis.username");
        const password = configService.get("redis.password");
        return {
          redis: {
            host: configService.get("redis.host"),
            port: configService.get("redis.port"),
            ...(username && { username }),
            ...(password && { password }),
          },
        };
      },
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: `/queues`,
      adapter: ExpressAdapter,
    }),
  ],
})
export class QueueModule {}

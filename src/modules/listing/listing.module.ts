import { Module } from "@nestjs/common";
import { ListingService } from "./listing.service";
import { ListingController } from "./listing.controller";
import { BullModule } from "@nestjs/bull";
import { ListingProducer } from "./queue/listing.producers";
import { ListingConsumer } from "./queue/lisitng.consumers";
import { LISTING_QUEUE } from "./queue/queue.constant";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { UtilitiesModule } from "src/utilities/utilities.module";

@Module({
  imports: [
    BullModule.registerQueue({ name: LISTING_QUEUE }),
    BullBoardModule.forFeature({
      name: LISTING_QUEUE,
      adapter: BullAdapter,
    }),
    UtilitiesModule,
  ],
  controllers: [ListingController],
  providers: [ListingService, ListingProducer, ListingConsumer],
})
export class ListingModule {}

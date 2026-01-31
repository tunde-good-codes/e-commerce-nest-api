import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import type { Queue } from "bull";
import { LISTING_QUEUE } from "./queue.constant";

@Injectable()
export class ListingProducer {
  constructor(@InjectQueue(LISTING_QUEUE) private listingQueue: Queue) {}

  async createListingImage(image: Express.Multer.File) {
    return await this.listingQueue.add(`createListingImage`, image);
  }
}

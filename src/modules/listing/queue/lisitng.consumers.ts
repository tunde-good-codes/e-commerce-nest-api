import { Process, Processor } from "@nestjs/bull";
import type { Job } from "bull";
import { LISTING_QUEUE } from "./queue.constant";
import { BaseConsumer } from "src/core/queue/base.consumer";
import { LoggerService } from "src/core/logger/logger-service";
import { FileService } from "src/utilities/file/file.service";
import { UploadListingImageDto } from "../dto/create-listing-image.dto";

@Processor(LISTING_QUEUE)
export class ListingConsumer extends BaseConsumer {
  constructor(
    logger: LoggerService,
    private readonly fileService: FileService
  ) {
    super(logger);
  }

  @Process(`createListingImage`)
  createListingImage(job: Job<UploadListingImageDto>) {
    const buffer = this.fileService.base64ToBuffer(job.data.base64File);
    // TODO: upload file to Google Cloud Storage
    // TODO: store respective Google Cloud Storage URL in database
  }
}

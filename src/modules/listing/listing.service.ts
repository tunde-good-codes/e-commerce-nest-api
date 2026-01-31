import { Injectable } from "@nestjs/common";
import { CreateListingDto } from "./dto/create-listing.dto";
import { PrismaService } from "../../database/prisma.service";
import { ListingProducer } from "./queue/listing.producers";
import { FileService } from "src/utilities/file/file.service";

@Injectable()
export class ListingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly listingQueue: ListingProducer,
    private readonly fileService: FileService,
  ) {}

  async create({
    data,
    images,
  }: {
    data: CreateListingDto;
    images: Express.Multer.File[];
  }) {
    const listing = await this.prismaService.listing.create({
      data,
    });
    for (const image of images) {
      await this.listingQueue.uploadListingImage({
        base64File: this.fileService.bufferToBase64(image.buffer),
        mimeType: image.mimetype,
        listingId: listing.id,
      });
    }
    return listing;
  }
}

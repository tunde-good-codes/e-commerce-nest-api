import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from "@nestjs/common";
import { ListingService } from "./listing.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MaxFileCountPipe } from "src/common/pipes/max-file-count/max-file-count.pipe";

@Controller("listing")
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("images"))
  create(
    @Body() createListingDto: CreateListingDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: `.(png|jpg|jpeg)` }),
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 1,
          }),
        ],
      }),
      new MaxFileCountPipe(3),
    )
    images: Express.Multer.File[],
  ) {
    return this.listingService.create({ data: createListingDto, images });
  }
}

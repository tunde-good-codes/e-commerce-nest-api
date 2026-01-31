import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UrlService } from "./url.service";
import { CreateUrlDto } from "./dto/create-url.dto";
import { UpdateUrlDto } from "./dto/update-url.dto";
import type { Response } from "express";
import { UrlExistsPipe } from "./pipes/url-exists/url-exists.pipe";
import type { Url } from "@prisma/client";
import { FilterUrlsDto } from "./dto/get-url-dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller()
@UseGuards(AuthGuard)
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post("url")
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.create(createUrlDto);
  }
  @Get("url")
  findAll(@Query() queryParams: FilterUrlsDto) {
    return this.urlService.findAll(queryParams);
  }

  @Get(":uid")
  findOne(@Param("uid", UrlExistsPipe) url: Url, @Res() res: Response) {
    res.redirect(url.redirect);
  }
  @Patch("url/:uid")
  update(
    @Param("uid", UrlExistsPipe) url: Url,
    @Body() updateUrlDto: UpdateUrlDto
  ) {
    return this.urlService.update(url.id, updateUrlDto);
  }

  @Delete("url/:uid")
  remove(@Param("uid", UrlExistsPipe) url: Url) {
    return this.urlService.remove(url.id);
  }
}

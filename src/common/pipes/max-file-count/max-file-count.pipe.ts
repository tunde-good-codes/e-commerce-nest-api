import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class MaxFileCountPipe implements PipeTransform {
  constructor(private readonly maxCount: number) {}
  transform(files: Express.Multer.File[]) {
    if (files.length > this.maxCount) {
      throw new BadRequestException(
        `the max files allowed is ${this.maxCount}. you uploaded ${files.length}`,
      );
    }

    return files;
  }
}

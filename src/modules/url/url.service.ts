import { Injectable } from "@nestjs/common";
import { CreateUrlDto } from "./dto/create-url.dto";
import { UpdateUrlDto } from "./dto/update-url.dto";
import { UidService } from "src/services/uid/uid.service";
import { PrismaService } from "src/database/prisma.service";
import { ConfigService } from "@nestjs/config";
import { FilterUrlsDto } from "./dto/get-url-dto";
@Injectable()
export class UrlService {
  private host: string;
  constructor(
    private readonly uidService: UidService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}
  OnModuleInit() {
    this.host = this.configService.getOrThrow<string>(`host`);
    console.log(`${this.host}`);
  }

  create(createUrlDto: CreateUrlDto) {
    const randomId = this.uidService.generate(6);
    const baseUrl = this.configService.get<string>("host");

    if (!baseUrl) {
      throw new Error("host is not configured");
    }

    const url = this.prismaService.url.create({
      data: {
        ...createUrlDto,
        url: `${baseUrl}/${randomId}`,
      },
    });

    return url;
  }

  async findAll({ page = 1, limit = 10, filter }: FilterUrlsDto) {
    const skip = (page - 1) * limit;
    const whereClause = filter
      ? {
          OR: [
            { title: { contains: filter } },
            { description: { contains: filter } },
            { redirect: { contains: filter } },
            { url: { contains: filter } },
          ],
        }
      : {};
    const data = await this.prismaService.url.findMany({
      where: whereClause,
      skip,
      take: limit,
    });
    const totalCount = await this.prismaService.url.count({
      where: whereClause,
    });

    const meta = {
      totalCount,
      currentPage: page,
      perPage: limit,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: skip + limit < totalCount,
      hasPreviousPage: skip > 0 && page > 1,
    };

    return { data, meta };
  }

  async findOne(uid: string) {
    const baseUrl = this.configService.get<string>("host");

    return await this.prismaService.url.findUnique({
      where: {
        url: `${baseUrl}/${uid}`,
      },
    });
  }
  async update(id: number, updateUrlDto: UpdateUrlDto) {
    return await this.prismaService.url.update({
      where: {
        id,
      },
      data: updateUrlDto,
    });
  }

  async remove(id: number) {
    return await this.prismaService.url.delete({
      where: {
        id,
      },
    });
  }
}

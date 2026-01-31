import { IsInt, IsOptional, Min } from "class-validator";
import { Transform } from "class-transformer";
export class GetUsersDto {
  @IsOptional()
  filter?: string;
  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  page?: number;
  @Min(1)
  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @Min(1)
  limit?: number;
}
export class PaginationDto {
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(1)
  page?: number;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(1)
  limit?: number;
}

export class FilterUrlsDto extends PaginationDto {
  @IsOptional()
  filter?: string;
}

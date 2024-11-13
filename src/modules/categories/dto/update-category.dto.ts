import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Type } from 'class-transformer';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Category 1 -- updated',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: null,
  })
  @IsObjectId()
  @IsOptional()
  parentCategoryId: ObjectId;

  @ApiProperty({
    example: 0,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  ranking: number;
}

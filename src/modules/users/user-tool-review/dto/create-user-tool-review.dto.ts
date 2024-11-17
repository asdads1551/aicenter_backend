import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class CreateUserToolReviewDto {
  @ApiProperty({
    example: '<toolId>',
  })
  @IsObjectId()
  toolId: string;

  @ApiProperty({
    example: 3,
    description: '分數範圍 1 ~ 5',
  })
  @Min(1)
  @Max(5)
  @IsNumber()
  rating: number;

  @ApiProperty({
    example: '評論',
  })
  @IsString()
  @IsOptional()
  comment: string;
}

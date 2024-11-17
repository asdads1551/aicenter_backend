import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class QueryToolReviewDto {
  @ApiProperty({
    example: '<userId>',
  })
  @IsOptional()
  @IsObjectId()
  userId: string;

  @ApiProperty({
    example: '<toolId>',
  })
  @IsOptional()
  @IsObjectId()
  toolId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class QueryToolSaveDto {
  @ApiProperty({
    example: '<userId>',
    required: false,
  })
  @IsOptional()
  @IsObjectId()
  userId?: string;

  @ApiProperty({
    example: '<toolId>',
    required: false,
  })
  @IsOptional()
  @IsObjectId()
  toolId?: string;
}

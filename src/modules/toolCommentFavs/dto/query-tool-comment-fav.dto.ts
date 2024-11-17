import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class QueryToolCommentFavDto {
  @ApiProperty({
    example: '<userId>',
  })
  @IsOptional({ message: 'userId must be a valid ObjectId' })
  @IsObjectId()
  userId: string;

  @ApiProperty({
    example: '<toolId>',
  })
  @IsOptional()
  @IsObjectId({ message: 'toolId must be a valid ObjectId' })
  toolId: string;

  @ApiProperty({
    example: '<toolId>',
  })
  @IsOptional()
  @IsObjectId({ message: 'toolCommentId must be a valid ObjectId' })
  toolCommentId: string;
}
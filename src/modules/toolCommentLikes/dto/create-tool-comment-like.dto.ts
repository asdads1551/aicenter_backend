import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class CreateToolCommentLikeDto {
  @ApiProperty({
    example: '<userId>',
  })
  @IsObjectId({ message: 'userId must be a valid ObjectId' })
  userId: string;

  @ApiProperty({
    example: '<toolId>',
  })
  @IsObjectId({ message: 'toolId must be a valid ObjectId' })
  toolId: string;

  @ApiProperty({
    example: '<toolCommentId>',
  })
  @IsObjectId({ message: 'toolCommentId must be a valid ObjectId' })
  toolCommentId: string;
}

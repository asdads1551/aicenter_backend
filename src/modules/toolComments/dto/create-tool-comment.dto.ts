import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class CreateToolCommentDto {
  @ApiProperty({
    example: '<userId>',
  })
  @IsObjectId()
  userId: string;

  @ApiProperty({
    example: '<toolId>',
  })
  @IsObjectId()
  toolId: string;

  @ApiProperty({
    example: '<comment>',
  })
  @IsObjectId()
  comment: string;
}

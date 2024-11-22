import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class UpdateToolCommentDto {
  @ApiProperty({
    example: '<comment>',
  })
  @IsObjectId()
  comment: string;
}

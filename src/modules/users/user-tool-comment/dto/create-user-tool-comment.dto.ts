import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class CreateUserToolCommentDto {
  @ApiProperty({
    example: '<toolId>',
  })
  @IsObjectId()
  toolId: string;

  @ApiProperty({
    example: '留言內容',
  })
  @IsString()
  comment: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserToolCommentDto {
  @ApiProperty({
    example: '留言內容',
  })
  @IsString()
  comment: string;
}

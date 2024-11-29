import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class GetUserBasicInfosDto {
  @ApiProperty({
    example: '<userId1>,<userId2>',
  })
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  userIds: string[];
}

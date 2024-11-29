import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMeDto {
  @ApiProperty({
    example: 'updated-fake-name',
  })
  @IsString()
  nickname: string;
}

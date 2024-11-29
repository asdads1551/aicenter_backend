import { ApiProperty } from '@nestjs/swagger';

export class UserBasicInfo {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  avatarUrl: string;
}

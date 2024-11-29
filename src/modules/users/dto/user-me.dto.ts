import { ApiProperty } from '@nestjs/swagger';

export class UserMeInfo {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  isGoogleUser: boolean;

  @ApiProperty()
  isGithubUser: boolean;
}

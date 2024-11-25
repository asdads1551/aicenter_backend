import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'User title',
  })
  @IsString()
  @IsOptional()
  nickname: string;

  @ApiProperty({
    example: 'https://fakeimg.pl/350x200/?text=Hello',
  })
  @IsString()
  @IsOptional()
  avatarUrl: string;

  @ApiProperty({
    example: 'google',
  })
  @IsString()
  @IsOptional()
  isGoogleUser: boolean;

  @ApiProperty({
    example: 'google',
  })
  @IsString()
  @IsOptional()
  isGithubUser: boolean;

  @ApiProperty({
    example: {},
  })
  @IsString()
  @IsOptional()
  sourceData: any;
}

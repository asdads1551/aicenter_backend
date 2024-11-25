import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
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
  avatarUrl: string;

  @ApiProperty({
    example: 'user@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: true,
  })
  @IsString()
  isGoogleUser?: boolean;

  @ApiProperty({
    example: true,
  })
  @IsString()
  isGithubUser?: boolean;

  @ApiProperty({
    example: {
      google: {
        profile: {
          emails: [{ value: 'user@example.com' }],
          name: { givenName: 'John', familyName: 'Doe' },
        },
      },
    },
  })
  @IsString()
  sourceData: any;
}

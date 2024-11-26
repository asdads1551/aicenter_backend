import { ApiProperty } from '@nestjs/swagger';

export class MockSigninDto {
  @ApiProperty({
    example: 'user1@example.com',
  })
  email: string;
}

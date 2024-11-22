import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class CreateUserToolLikeDto {
  @ApiProperty({
    example: '<toolId>',
  })
  @IsObjectId()
  toolId: string;
}

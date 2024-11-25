import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class CreateUserToolFavDto {
  @ApiProperty({
    example: '<toolId>',
  })
  @IsObjectId()
  toolId: string;
}

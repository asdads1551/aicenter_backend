import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class CreateUserToolSaveDto {
  @ApiProperty({
    example: '<toolId>',
  })
  @IsObjectId()
  toolId: string;
}

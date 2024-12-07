import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class CreateToolSaveDto {
  @ApiProperty({
    example: '<userId>',
  })
  @IsObjectId()
  userId: string;

  @ApiProperty({
    example: '<toolId>',
  })
  @IsObjectId()
  toolId: string;
}

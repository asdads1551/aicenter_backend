import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class ToolTagDto {
  @ApiProperty({
    example: '免費',
  })
  @IsString()
  name: string;
}

export class CreateToolDto {
  @ApiProperty({
    example: 'Tool title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'https://fakeimg.pl/350x200/?text=Hello',
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: 'Tool overview',
  })
  @IsString()
  overview: string;

  @ApiProperty({
    example: '#markdown',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'https://google.com',
  })
  @IsString()
  url: string;

  @ApiProperty({
    example: ['673dc5b7574ab4d42a37bba1'],
  })
  @IsArray()
  @IsString({ each: true })
  categoryIds: string[];

  @ApiProperty({
    example: '673dc5b7574ab4d42a37bba1',
  })
  @IsString()
  mainCategoryId: string;

  @ApiProperty({
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isAd: boolean;

  @ApiProperty({
    example: [{ name: '免費' }],
  })
  @IsArray()
  @IsOptional()
  tags: ToolTagDto;
}

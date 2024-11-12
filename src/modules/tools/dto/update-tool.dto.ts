import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ToolTagDto } from './create-tool.dto';

export class UpdateToolDto {
  @ApiProperty({
    example: 'Tool title -- updated',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    example: 'https://fakeimg.pl/350x200/?text=Hello2',
  })
  @IsString()
  @IsOptional()
  imageUrl: string;

  @ApiProperty({
    example: 'Tool overview -- updated',
  })
  @IsString()
  @IsOptional()
  overview: string;

  @ApiProperty({
    example: '#markdown -- updated',
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({
    example: 'https://www.google.com/search?q=hello+world',
  })
  @IsString()
  @IsOptional()
  url: string;

  @ApiProperty({
    example: [4, 5],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  categoryIds: number[];

  @ApiProperty({
    example: 4,
  })
  @IsInt()
  @IsOptional()
  mainCategoryId: number;

  @ApiProperty({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAd: boolean;

  @ApiProperty({
    example: [{ name: '免費2' }, { name: '文案編輯' }],
  })
  @IsArray()
  @IsOptional()
  tags: ToolTagDto;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({ example: 'Woodcraft & Design Guides' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'woodcraft-and-design-guides' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Expert advice on woodworking and styling.' })
  @IsOptional()
  @IsString()
  description?: string;
}

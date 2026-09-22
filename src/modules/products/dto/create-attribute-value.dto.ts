import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttributeValueDto {
  @ApiProperty({ example: 'Solid Walnut' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'walnut', description: 'Internal value/slug' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ example: '#5C4033', description: 'Hex color code for swatch preview' })
  @IsOptional()
  @IsString()
  colorHex?: string;
}

export class UpdateAttributeValueDto {
  @ApiPropertyOptional({ example: 'Solid Walnut' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'walnut' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ example: '#5C4033' })
  @IsOptional()
  @IsString()
  colorHex?: string;
}

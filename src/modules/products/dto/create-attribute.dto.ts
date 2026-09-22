import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttributeDto {
  @ApiProperty({ example: 'Wood Finish' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'wood-finish', description: 'Generated from name if not provided' })
  @IsOptional()
  @IsString()
  slug?: string;
}

export class UpdateAttributeDto {
  @ApiPropertyOptional({ example: 'Wood Finish' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'wood-finish' })
  @IsOptional()
  @IsString()
  slug?: string;
}

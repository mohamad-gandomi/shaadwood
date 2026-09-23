import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({ example: 'order-uuid-here' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ example: 'ZARINPAL', description: 'Selected gateway: ZARINPAL, STRIPE, MELLAT, SAMAN_SEP' })
  @IsString()
  @IsNotEmpty()
  gateway: string;

  @ApiPropertyOptional({ example: 'http://localhost:4001/checkout/callback' })
  @IsOptional()
  @IsString()
  callbackUrl?: string;
}

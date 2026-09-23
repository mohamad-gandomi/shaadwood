import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Public()
  @Get('methods')
  @ApiOperation({ summary: 'Public: List available shipping methods, carriers, and rates' })
  getMethods() {
    return this.shippingService.findAll();
  }

  @Public()
  @Get('methods/:id')
  @ApiOperation({ summary: 'Public: Get details for specific shipping method' })
  getMethod(@Param('id') id: string) {
    return this.shippingService.findById(id);
  }
}

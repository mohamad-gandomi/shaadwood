import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ZarinpalProvider } from './providers/zarinpal.provider';
import { MockStripeProvider } from './providers/mock-stripe.provider';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, ZarinpalProvider, MockStripeProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}

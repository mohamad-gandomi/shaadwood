import { Injectable } from '@nestjs/common';

export interface ShippingMethodOption {
  id: string;
  name: string;
  carrier: string;
  price: number;
  currency: string;
  estimatedDays: string;
  description: string;
  supportsTracking: boolean;
}

@Injectable()
export class ShippingService {
  private shippingMethods: ShippingMethodOption[] = [
    {
      id: 'white-glove-freight',
      name: 'White Glove Freight Delivery',
      carrier: 'FedEx Freight / Specialized Heavy Logistics',
      price: 75.0,
      currency: 'USD',
      estimatedDays: '5-10 business days',
      description: 'Scheduled two-person delivery to room of choice, full unpacking, inspection, and debris removal.',
      supportsTracking: true,
    },
    {
      id: 'standard-freight',
      name: 'Standard Furniture Freight',
      carrier: 'Old Dominion / Chapar Heavy Freight',
      price: 50.0,
      currency: 'USD',
      estimatedDays: '4-7 business days',
      description: 'Curbside liftgate delivery. Secure timber crating and weather-proof wrapping included.',
      supportsTracking: true,
    },
    {
      id: 'express-courier-tipax',
      name: 'Express Courier (Tipax / Chapar / Regional)',
      carrier: 'Tipax Express Courier',
      price: 35.0,
      currency: 'USD',
      estimatedDays: '1-3 business days',
      description: 'Expedited parcel dispatch for smaller furniture accents, accessories, and upholstery swatches.',
      supportsTracking: true,
    },
    {
      id: 'local-workshop-pickup',
      name: 'Showroom & Workshop Direct Pickup',
      carrier: 'Self-Pickup (Shaadwood Woodcraft Studio)',
      price: 0.0,
      currency: 'USD',
      estimatedDays: '1-2 business days',
      description: 'Collect your finished pieces directly from our master workshop. Loading assistance provided.',
      supportsTracking: false,
    },
  ];

  findAll(): ShippingMethodOption[] {
    return this.shippingMethods;
  }

  findById(id: string): ShippingMethodOption | undefined {
    return this.shippingMethods.find((m) => m.id === id);
  }
}

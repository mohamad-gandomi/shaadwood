'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { api } from '@/lib/api';
import { ShippingMethodOption, PaymentGatewayOption } from '@/types';
import { CheckoutContactForm, CheckoutContactData } from '@/components/storefront/checkout/checkout-contact-form';
import { CheckoutShippingForm, CheckoutShippingData } from '@/components/storefront/checkout/checkout-shipping-form';
import { CheckoutShippingMethod } from '@/components/storefront/checkout/checkout-shipping-method';
import { CheckoutPaymentMethod } from '@/components/storefront/checkout/checkout-payment-method';
import { CheckoutSummarySidebar } from '@/components/storefront/checkout/checkout-summary-sidebar';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    totalPrice: subtotal,
    clearCart,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  // Contact State - clean initial empty strings
  const [contact, setContact] = React.useState<CheckoutContactData>({
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
  });

  // Shipping Destination State - clean initial empty strings
  const [shipping, setShipping] = React.useState<CheckoutShippingData>({
    recipientName: '',
    phone: '',
    province: '',
    city: '',
    street: '',
    postalCode: '',
    deliveryNotes: '',
  });

  // Shipping Methods & Selected
  const [shippingMethods, setShippingMethods] = React.useState<ShippingMethodOption[]>([]);
  const [selectedMethodId, setSelectedMethodId] = React.useState<string>('');

  // Gateways & Selected
  const [gateways, setGateways] = React.useState<PaymentGatewayOption[]>([]);
  const [selectedGatewayId, setSelectedGatewayId] = React.useState<string>('ZARINPAL');

  // Coupon Input State (for applying inside checkout sidebar)
  const [couponCodeInput, setCouponCodeInput] = React.useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = React.useState(false);
  const [couponError, setCouponError] = React.useState<string | null>(null);

  // Form Errors & Submitting
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Load Shipping Methods & Gateways & Prefill ONLY if logged in customer
  React.useEffect(() => {
    // Only prefill if authenticated as actual CUSTOMER (never admin fallback)
    const user = api.getCurrentUser();
    if (user && user.role === 'CUSTOMER' && user.email !== 'admin@shaadwood.com') {
      setContact({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setShipping((prev) => ({
        ...prev,
        recipientName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        phone: user.phone || '',
      }));
    }

    // Fetch Shipping Methods from database
    api
      .getShippingMethods()
      .then((methods) => {
        if (methods && methods.length > 0) {
          setShippingMethods(methods);
          const defaultMethod = methods.find((m) => m.isDefault) || methods[0];
          setSelectedMethodId(defaultMethod.id);
        }
      })
      .catch(() => {
        // Fallback default methods
        const fallbacks: ShippingMethodOption[] = [
          {
            id: 'fixed-freight',
            name: 'Fixed-Rate Furniture Freight',
            carrier: 'Chapar / Old Dominion Heavy Freight',
            price: 50,
            currency: 'USD',
            estimatedDays: '3-6 business days',
            description: 'Standard fixed-rate curbside freight with timber packaging.',
            isDefault: true,
            isActive: true,
            displayOrder: 1,
            supportsTracking: true,
          },
        ];
        setShippingMethods(fallbacks);
        setSelectedMethodId(fallbacks[0].id);
      });

    // Fetch Payment Gateways
    api
      .getPaymentGateways()
      .then((gws) => {
        if (gws && gws.length > 0) {
          setGateways(gws);
          setSelectedGatewayId(gws[0].id);
        }
      })
      .catch(() => {
        setGateways([
          {
            id: 'ZARINPAL',
            name: 'زرین‌پال (شاپرک / شتاب - Zarinpal)',
            type: 'IRANIAN_SHAPARAK',
            description: 'پرداخت امن با کلیه کارت‌های عضو شبکه شتاب',
            currencies: ['IRT', 'USD'],
            isActive: true,
          },
        ]);
      });
  }, []);

  const selectedMethod = React.useMemo(() => {
    return shippingMethods.find((m) => m.id === selectedMethodId) || shippingMethods[0];
  }, [shippingMethods, selectedMethodId]);

  // Standard fixed shipping rate from the selected method
  const shippingCost = selectedMethod ? selectedMethod.price : 0;

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.08 * 100) / 100;
  const grandTotal = Math.round((taxableAmount + shippingCost + taxAmount) * 100) / 100;

  // Validate and Apply Coupon (persists into CartContext)
  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await api.validateCoupon(couponCodeInput.trim(), subtotal);
      if (res.valid && res.coupon) {
        applyCoupon(res.coupon, res.discountAmount);
        setCouponCodeInput('');
        toast.success(`Coupon "${res.coupon.code}" applied! Saved $${res.discountAmount.toFixed(2)}`);
      } else {
        setCouponError(res.message || 'Invalid or expired coupon code');
        toast.error(res.message || 'Invalid coupon code');
      }
    } catch (err: any) {
      setCouponError(err.message || 'Error validating voucher');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCodeInput('');
    setCouponError(null);
    toast.info('Coupon discount removed');
  };

  // Form Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!contact.phone.trim()) {
      errs.phone = 'Mobile phone number is required';
    } else if (contact.phone.trim().replace(/\D/g, '').length < 10) {
      errs.phone = 'Please enter a valid phone number (at least 10 digits)';
    }

    if (!contact.firstName.trim()) {
      errs.firstName = 'First name is required';
    }
    if (!contact.lastName.trim()) {
      errs.lastName = 'Last name is required';
    }

    const recipient = shipping.recipientName.trim() || `${contact.firstName} ${contact.lastName}`.trim();
    if (!recipient) {
      errs.recipientName = 'Recipient name is required';
    }

    const shippingPhone = shipping.phone.trim() || contact.phone.trim();
    if (!shippingPhone) {
      errs.shippingPhone = 'Delivery phone is required';
    }

    if (!shipping.province.trim()) {
      errs.province = 'Province is required';
    }
    if (!shipping.city.trim()) {
      errs.city = 'City is required';
    }
    if (!shipping.street.trim()) {
      errs.street = 'Street address is required';
    }
    if (!shipping.postalCode.trim()) {
      errs.postalCode = 'Postal code is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Order
  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      toast.error('Please complete all required fields highlighted in red');
      return;
    }

    setIsSubmitting(true);
    try {
      const recipientName =
        shipping.recipientName.trim() || `${contact.firstName.trim()} ${contact.lastName.trim()}`;
      const deliveryPhone = shipping.phone.trim() || contact.phone.trim();

      const orderPayload = {
        customerName: `${contact.firstName.trim()} ${contact.lastName.trim()}`,
        customerPhone: contact.phone.trim(),
        customerEmail: contact.email.trim() || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || undefined,
          quantity: item.quantity,
        })),
        couponCode: appliedCoupon?.code || undefined,
        paymentMethod: selectedGatewayId,
        shippingMethod: selectedMethod?.name || 'Standard Furniture Freight',
        shippingCarrier: selectedMethod?.carrier || 'Chapar / Old Dominion',
        shippingAddress: {
          recipientName,
          phone: deliveryPhone,
          street: shipping.street.trim(),
          city: shipping.city.trim(),
          province: shipping.province.trim(),
          postalCode: shipping.postalCode.trim(),
          country: 'Iran',
        },
        customerNotes: shipping.deliveryNotes?.trim() || undefined,
      };

      const createdOrder = await api.createOrder(orderPayload);

      clearCart();
      toast.success(`Commission confirmed! Order ${createdOrder.orderNumber} placed.`);
      router.push(`/checkout/success/${createdOrder.id}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      toast.error(err.message || 'Failed to place order. Please review your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-shaad-50 flex items-center justify-center text-shaad-800 mb-5 border border-shaad-200">
          <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Your Studio Cart is Empty
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
          Select handcrafted solid wood pieces from our curated atelier to begin your commission and checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-shaad-800 hover:bg-shaad-900 text-white font-medium text-sm shadow-md transition-all"
        >
          <span>Explore Atelier Catalog</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-50/40 pb-24">
      {/* Breadcrumb & Heading Bar */}
      <div className="border-b border-border/60 bg-white/80 backdrop-blur-md sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <Link href="/cart" className="hover:text-foreground transition-colors">
              Cart
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-semibold">Studio Checkout</span>
          </div>

          <Link
            href="/cart"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-shaad-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Cart</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="mb-8">
          <span className="text-[11px] font-mono uppercase tracking-widest text-shaad-800 font-semibold block mb-1">
            Bespoke Commission & Dispatch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Studio Checkout
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Confirm your delivery destination and preferred settlement gateway. All pieces include protective packaging and dedicated logistics.
          </p>
        </div>

        {/* Checkout 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Flow (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact & Guest Auto-Registration */}
            <CheckoutContactForm data={contact} onChange={setContact} errors={errors} />

            {/* Step 2: Shipping Destination */}
            <CheckoutShippingForm data={shipping} onChange={setShipping} errors={errors} />

            {/* Step 3: Shipping Method Selection */}
            {shippingMethods.length > 0 && (
              <CheckoutShippingMethod
                methods={shippingMethods}
                selectedMethodId={selectedMethodId}
                onSelect={(m) => setSelectedMethodId(m.id)}
              />
            )}

            {/* Step 4: Payment Gateway Selection */}
            {gateways.length > 0 && (
              <CheckoutPaymentMethod
                gateways={gateways}
                selectedGatewayId={selectedGatewayId}
                onSelect={setSelectedGatewayId}
              />
            )}
          </div>

          {/* Sticky Summary & Actions Sidebar (Right 5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <CheckoutSummarySidebar
              items={items}
              subtotal={subtotal}
              shippingAmount={shippingCost}
              coupon={appliedCoupon}
              discountAmount={discountAmount}
              taxAmount={taxAmount}
              grandTotal={grandTotal}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmitOrder}
              couponCodeInput={couponCodeInput}
              onCouponInputChange={setCouponCodeInput}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              isValidatingCoupon={isValidatingCoupon}
              couponError={couponError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

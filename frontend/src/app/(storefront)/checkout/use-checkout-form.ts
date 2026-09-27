'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { api } from '@/lib/api';
import { ShippingMethodOption, PaymentGatewayOption, Address } from '@/types';
import { CheckoutContactData } from '@/components/storefront/checkout/checkout-contact-form';
import { CheckoutShippingData } from '@/components/storefront/checkout/checkout-shipping-form';
import { toast } from 'sonner';

export function useCheckoutForm() {
  const router = useRouter();
  const { items, totalPrice: subtotal, clearCart, appliedCoupon, discountAmount, applyCoupon, removeCoupon } = useCart();

  const [contact, setContact] = React.useState<CheckoutContactData>({ phone: '', firstName: '', lastName: '', email: '' });
  const [shipping, setShipping] = React.useState<CheckoutShippingData>({
    recipientName: '', phone: '', province: '', city: '', street: '', postalCode: '', deliveryNotes: '',
  });

  const [shippingMethods, setShippingMethods] = React.useState<ShippingMethodOption[]>([]);
  const [selectedMethodId, setSelectedMethodId] = React.useState<string>('');
  const [gateways, setGateways] = React.useState<PaymentGatewayOption[]>([]);
  const [selectedGatewayId, setSelectedGatewayId] = React.useState<string>('ZARINPAL');
  const [couponCodeInput, setCouponCodeInput] = React.useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = React.useState(false);
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [savedAddresses, setSavedAddresses] = React.useState<Address[]>([]);

  React.useEffect(() => {
    const user = api.getCurrentUser();
    if (user && user.role === 'CUSTOMER' && user.email !== 'admin@shaadwood.com') {
      setContact({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '', phone: user.phone || '' });
      setShipping((prev) => ({ ...prev, recipientName: `${user.firstName || ''} ${user.lastName || ''}`.trim(), phone: user.phone || '' }));
      api.getMyAddresses().then((addrs) => {
        if (addrs && addrs.length > 0) {
          setSavedAddresses(addrs);
          const def = addrs.find((a) => a.isDefaultShipping) || addrs[0];
          if (def) setShipping((prev) => ({ ...prev, recipientName: def.recipientName, phone: def.phone, province: def.province, city: def.city, street: def.street, postalCode: def.postalCode }));
        }
      }).catch(() => {});
    }

    api.getShippingMethods().then((methods) => {
      if (methods && methods.length > 0) {
        setShippingMethods(methods);
        setSelectedMethodId((methods.find((m) => m.isDefault) || methods[0]).id);
      }
    }).catch(() => {});

    api.getPaymentGateways().then((gws) => {
      if (gws && gws.length > 0) { setGateways(gws); setSelectedGatewayId(gws[0].id); }
    }).catch(() => {});
  }, []);

  const selectedMethod = React.useMemo(() => shippingMethods.find((m) => m.id === selectedMethodId) || shippingMethods[0], [shippingMethods, selectedMethodId]);
  const shippingCost = selectedMethod ? selectedMethod.price : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const grandTotal = taxableAmount + shippingCost;

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await api.validateCoupon(couponCodeInput.trim(), subtotal);
      if (res.valid && res.coupon) {
        applyCoupon(res.coupon, res.discountAmount);
        setCouponCodeInput('');
        toast.success(`کد تخفیف «${res.coupon.code}» با موفقیت اعمال شد.`);
      } else {
        setCouponError(res.message || 'کد تخفیف نامعتبر یا منقضی شده است.');
      }
    } catch (err: any) {
      setCouponError(err.message || 'خطا در بررسی کد تخفیف');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!contact.phone.trim()) errs.phone = 'شماره تلفن همراه الزامی است';
    if (!contact.firstName.trim()) errs.firstName = 'نام الزامی است';
    if (!contact.lastName.trim()) errs.lastName = 'نام خانوادگی الزامی است';
    if (!shipping.recipientName.trim() && !contact.firstName.trim()) errs.recipientName = 'نام تحویل‌گیرنده الزامی است';
    if (!shipping.province.trim()) errs.province = 'استان الزامی است';
    if (!shipping.city.trim()) errs.city = 'شهر الزامی است';
    if (!shipping.street.trim()) errs.street = 'نشانی دقیق پستی الزامی است';
    if (!shipping.postalCode.trim()) errs.postalCode = 'کد پستی الزامی است';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      toast.error('لطفاً فیلدهای الزامی مشخص‌شده را تکمیل فرمایید.');
      return;
    }
    setIsSubmitting(true);
    try {
      const recipientName = shipping.recipientName.trim() || `${contact.firstName.trim()} ${contact.lastName.trim()}`;
      const deliveryPhone = shipping.phone.trim() || contact.phone.trim();
      const createdOrder = await api.createOrder({
        customerName: `${contact.firstName.trim()} ${contact.lastName.trim()}`,
        customerPhone: contact.phone.trim(),
        customerEmail: contact.email.trim() || undefined,
        items: items.map((i) => ({ productId: i.productId, variantId: i.variantId || undefined, quantity: i.quantity })),
        couponCode: appliedCoupon?.code || undefined,
        paymentMethod: selectedGatewayId,
        shippingMethod: selectedMethod?.name || 'ارسال اختصاصی مبلمان',
        shippingCarrier: selectedMethod?.carrier || 'باربری اختصاصی شادوود',
        shippingAddress: { recipientName, phone: deliveryPhone, street: shipping.street.trim(), city: shipping.city.trim(), province: shipping.province.trim(), postalCode: shipping.postalCode.trim(), country: 'Iran' },
        customerNotes: shipping.deliveryNotes?.trim() || undefined,
      });
      clearCart();
      toast.success(`سفارش شماره ${createdOrder.orderNumber} با موفقیت ثبت شد.`);
      router.push(`/checkout/success/${createdOrder.id}`);
    } catch (err: any) {
      toast.error(err.message || 'خطا در ثبت سفارش. لطفاً اطلاعات را بررسی کرده و مجدداً تلاش فرمایید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    contact, setContact, shipping, setShipping, shippingMethods, selectedMethodId, setSelectedMethodId,
    gateways, selectedGatewayId, setSelectedGatewayId, couponCodeInput, setCouponCodeInput, isValidatingCoupon,
    couponError, errors, isSubmitting, savedAddresses, items, subtotal, shippingCost, appliedCoupon,
    discountAmount, grandTotal, handleApplyCoupon, removeCoupon, handleSubmitOrder,
  };
}

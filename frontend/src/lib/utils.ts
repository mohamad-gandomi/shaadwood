import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '۰ تومان';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${new Intl.NumberFormat('fa-IR').format(num)} تومان`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('fa-IR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

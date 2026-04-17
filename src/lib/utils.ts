import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type Currency = 'CRC' | 'USD';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatters: Record<Currency, Intl.NumberFormat> = {
  CRC: new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
};

export function formatPrice(amount: number, currency: Currency): string {
  return formatters[currency].format(amount);
}

export function formatCompactPrice(amount: number, currency: Currency): string {
  const symbol = currency === 'CRC' ? '₡' : '$';
  if (amount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${symbol}${(amount / 1_000).toFixed(0)}K`;
  }
  return formatPrice(amount, currency);
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  const base = `https://wa.me/${cleaned}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

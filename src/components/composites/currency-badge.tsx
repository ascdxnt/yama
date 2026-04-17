import { cn } from '@/lib/utils';
import type { Currency } from '@/lib/utils';

interface CurrencyBadgeProps {
  currency: Currency;
  className?: string;
}

export function CurrencyBadge({ currency, className }: CurrencyBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold',
        currency === 'CRC'
          ? 'bg-primary-50 text-primary-700'
          : 'bg-emerald-50 text-emerald-700',
        className
      )}
    >
      {currency === 'CRC' ? '₡ CRC' : '$ USD'}
    </span>
  );
}

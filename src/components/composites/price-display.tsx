import { formatPrice, type Currency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number;
  currency: Currency;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const sizeStyles = {
  sm: 'text-base font-bold',
  md: 'text-xl font-bold',
  lg: 'text-2xl font-extrabold tracking-tight',
  xl: 'text-3xl font-extrabold tracking-tight sm:text-4xl',
};

export function PriceDisplay({
  amount,
  currency,
  size = 'md',
  showLabel = false,
  label = 'Precio de lista · IVI incluido',
  className,
}: PriceDisplayProps) {
  return (
    <div className={cn('space-y-0.5', className)}>
      <p className={cn(sizeStyles[size], 'text-text-primary')}>
        {formatPrice(amount, currency)}
      </p>
      {showLabel && (
        <p className="text-sm text-text-muted">{label}</p>
      )}
    </div>
  );
}

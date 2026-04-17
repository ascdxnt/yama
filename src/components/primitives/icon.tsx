import { cn } from '@/lib/utils';

interface IconProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  'aria-hidden'?: boolean;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function Icon({ name, className, size = 'md', 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg className={cn(sizeMap[size], className)} aria-hidden={ariaHidden}>
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}

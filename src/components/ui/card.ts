import { cn } from '@lib/cn';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardStyleOptions {
  padding?: CardPadding;
  interactive?: boolean;
  className?: string;
}

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export function cardClasses({ padding = 'md', interactive = false, className }: CardStyleOptions = {}) {
  return cn(
    'rounded-3xl border border-white/5 bg-white/5 shadow-card backdrop-blur',
    paddingStyles[padding],
    interactive && 'transition hover:-translate-y-1 hover:bg-white/10',
    className
  );
}

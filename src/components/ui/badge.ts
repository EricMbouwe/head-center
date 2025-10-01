import { cn } from '@lib/cn';

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'info' | 'outline';

export interface BadgeStyleOptions {
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-white/10 text-white',
  accent: 'bg-indigoGlow/20 text-indigoGlow',
  success: 'bg-emerald-500/10 text-emerald-300',
  warning: 'bg-amber-500/10 text-amber-300',
  info: 'bg-cyanAura/20 text-cyanAura',
  outline: 'border border-white/20 text-slate-200'
};

export function badgeClasses({ variant = 'neutral', className }: BadgeStyleOptions = {}) {
  return cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]', variantStyles[variant], className);
}

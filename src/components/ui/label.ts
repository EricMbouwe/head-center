import { cn } from '@lib/cn';

export interface LabelStyleOptions {
  className?: string;
  subtle?: boolean;
}

export function labelClasses({ className, subtle = false }: LabelStyleOptions = {}) {
  return cn(
    'text-xs font-semibold uppercase tracking-[0.2em] text-cyanAura',
    subtle && 'text-slate-300 normal-case tracking-wide',
    className
  );
}

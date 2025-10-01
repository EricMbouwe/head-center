import { cn } from '@lib/cn';

export interface SelectStyleOptions {
  className?: string;
  hasError?: boolean;
}

export function selectClasses({ className, hasError = false }: SelectStyleOptions = {}) {
  return cn(
    'w-full rounded-2xl border border-white/10 bg-midnight/60 px-4 py-3 text-sm text-white transition focus:border-cyanAura focus:outline-none focus:ring-2 focus:ring-cyanAura/40',
    hasError && 'border-rose-400/60 focus:border-rose-300 focus:ring-rose-300/40',
    className
  );
}

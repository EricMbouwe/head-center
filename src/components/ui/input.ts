import { cn } from '@lib/cn';

export interface InputStyleOptions {
  className?: string;
  hasError?: boolean;
  isTextarea?: boolean;
}

export function inputClasses({ className, hasError = false, isTextarea = false }: InputStyleOptions = {}) {
  return cn(
    'w-full rounded-2xl border border-white/10 bg-midnight/60 px-4 text-sm text-white placeholder:text-slate-500 transition focus:border-cyanAura focus:outline-none focus:ring-2 focus:ring-cyanAura/40',
    isTextarea ? 'py-3' : 'py-3',
    hasError && 'border-rose-400/60 focus:border-rose-300 focus:ring-rose-300/40',
    className
  );
}

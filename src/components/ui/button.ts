import { cn } from '@lib/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'subtle'
  | 'success'
  | 'warning'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigoGlow text-white hover:bg-indigo-500 shadow-card',
  secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10',
  outline: 'border border-white/20 text-white hover:bg-white/10',
  ghost: 'text-indigoGlow hover:text-cyanAura hover:bg-indigoGlow/10',
  subtle: 'bg-cyanAura/10 text-cyanAura hover:bg-cyanAura/20',
  success: 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-200 hover:bg-amber-500/25',
  danger: 'bg-rose-500/15 text-rose-200 hover:bg-rose-500/25'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  icon: 'h-10 w-10'
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className
}: ButtonStyleOptions = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyanAura disabled:cursor-not-allowed disabled:opacity-60',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    className
  );
}

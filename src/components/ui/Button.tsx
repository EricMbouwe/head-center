import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { buttonClasses, type ButtonStyleOptions } from './button';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleOptions;

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & ButtonStyleOptions;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonClasses({ className, variant, size, fullWidth })}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => (
    <a
      ref={ref}
      className={buttonClasses({ className, variant, size, fullWidth })}
      {...props}
    />
  )
);

ButtonLink.displayName = 'ButtonLink';

export default Button;

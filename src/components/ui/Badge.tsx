import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { badgeClasses, type BadgeStyleOptions } from './badge';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & BadgeStyleOptions;

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={badgeClasses({ variant, className })} {...props} />
));

Badge.displayName = 'Badge';

export default Badge;

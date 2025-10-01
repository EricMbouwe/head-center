import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cardClasses, type CardStyleOptions } from './card';

type CardProps = HTMLAttributes<HTMLDivElement> & CardStyleOptions;

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, padding, interactive, ...props }, ref) => (
  <div ref={ref} className={cardClasses({ className, padding, interactive })} {...props} />
));

Card.displayName = 'Card';

export default Card;

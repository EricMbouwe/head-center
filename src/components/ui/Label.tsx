import type { LabelHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { labelClasses, type LabelStyleOptions } from './label';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & LabelStyleOptions;

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, subtle, ...props }, ref) => (
  <label ref={ref} className={labelClasses({ className, subtle })} {...props} />
));

Label.displayName = 'Label';

export default Label;

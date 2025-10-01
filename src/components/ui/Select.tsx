import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { selectClasses, type SelectStyleOptions } from './select';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & SelectStyleOptions;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, hasError, ...props }, ref) => (
  <select ref={ref} className={selectClasses({ className, hasError })} {...props} />
));

Select.displayName = 'Select';

export default Select;

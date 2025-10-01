import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { inputClasses, type InputStyleOptions } from './input';

type InputProps = InputHTMLAttributes<HTMLInputElement> & Omit<InputStyleOptions, 'isTextarea'>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, hasError, ...props }, ref) => (
  <input ref={ref} className={inputClasses({ className, hasError })} {...props} />
));

Input.displayName = 'Input';

export default Input;

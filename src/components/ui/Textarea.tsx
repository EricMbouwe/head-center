import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { inputClasses } from './input';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, hasError, ...props }, ref) => (
  <textarea ref={ref} className={inputClasses({ className, hasError, isTextarea: true })} {...props} />
));

Textarea.displayName = 'Textarea';

export default Textarea;

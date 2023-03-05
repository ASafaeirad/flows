import { forwardRef } from 'react';

type InputAttributes = Omit<JSX.IntrinsicElements['input'], 'onSelect'>;

export interface InputProps extends InputAttributes {
  onSelect?: (t: string) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ onSelect, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const text = (e.target as HTMLInputElement).value;
        onSelect?.(text);
      }
    };

    return (
      <input
        ref={ref}
        onKeyDown={handleKeyDown}
        className="w-full rounded border border-solid border-border bg-dark-1 px-5 py-3 text-light-0 placeholder-placeholder"
        {...props}
      />
    );
  },
);

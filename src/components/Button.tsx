import { forwardRef } from 'react';

type ReactButtonProps = JSX.IntrinsicElements['button'];

interface Props extends ReactButtonProps {}

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <button
      className="rounded bg-accent-0 py-2 font-bold text-dark-1"
      {...props}
      ref={ref}
    />
  );
});

import { forwardRef } from 'react';

type ReactButtonProps = JSX.IntrinsicElements['button'];

interface Props extends ReactButtonProps {}

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <button
      {...props}
      className={`rounded bg-accent-0 py-2 font-bold text-dark-1 ${
        props.className ?? ''
      }`}
      ref={ref}
    />
  );
});

export const GhostButton = forwardRef<HTMLButtonElement, Props>(
  (props, ref) => {
    return (
      <button
        {...props}
        className={`rounded border border-accent-0 py-2 font-bold text-accent-0 ${
          props.className ?? ''
        }`}
        ref={ref}
      />
    );
  },
);

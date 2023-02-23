export const Input = (props: JSX.IntrinsicElements['input']) => {
  return (
    <input
      {...props}
      className="w-full rounded border border-solid border-border bg-dark-1 px-5 py-3 text-light-0 placeholder-placeholder"
    />
  );
};

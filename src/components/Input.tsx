export const Input = (props: JSX.IntrinsicElements['input']) => {
  return (
    <input
      {...props}
      className="w-full rounded border border-solid border-white/10 bg-bg-700 px-5 py-3 text-white placeholder-white/20"
    />
  );
};

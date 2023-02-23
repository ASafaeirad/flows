type InputAttributes = Omit<JSX.IntrinsicElements['input'], 'onSelect'>;

interface Props extends InputAttributes {
  onSelect?: (t: string) => void;
}

export const Input = ({ onSelect, ...props }: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const text = e.target.value;
      onSelect?.(text);
    }
  };

  return (
    <input
      onKeyDown={handleKeyDown}
      className="w-full rounded border border-solid border-border bg-dark-1 px-5 py-3 text-light-0 placeholder-placeholder"
      {...props}
    />
  );
};

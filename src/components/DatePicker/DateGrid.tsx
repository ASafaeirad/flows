export const DateGrid = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <div className="grid-cols-7-auto my-1 grid w-full justify-between gap-y-0.5">
      {children}
    </div>
  );
};

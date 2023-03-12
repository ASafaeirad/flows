import { Button, GhostButton } from './Button';

interface Props {
  onConfirm: VoidFunction;
  onCancel: VoidFunction;
  children: React.ReactNode;
}

export const DeleteConfirm = ({ onConfirm, onCancel, children }: Props) => {
  return (
    <div className="bg-bg-700 flex flex-col gap-3 rounded border border-border py-3 px-5">
      <div>{children}</div>
      <div className="flex gap-4">
        <GhostButton autoFocus onClick={onCancel} className="flex-1">
          No
        </GhostButton>
        <Button onClick={onConfirm} className="flex-1">
          Yes
        </Button>
      </div>
    </div>
  );
};

import { format } from 'date-fns';

interface Props {
  value: Date;
}

export const MonthItem = ({ value }: Props): JSX.Element => {
  return (
    <button className="flex rounded text-sm text-light-1">
      {format(value, 'MMMM')}
    </button>
  );
};

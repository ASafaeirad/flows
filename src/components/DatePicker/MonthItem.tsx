import { format } from 'date-fns';

interface Props {
  value: Date;
}

export const MonthItem = ({ value }: Props): JSX.Element => {
  return (
    <button className="text-light-1 flex rounded text-sm">
      {format(value, 'MMMM')}
    </button>
  );
};

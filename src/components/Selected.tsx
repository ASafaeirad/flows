import { format } from 'date-fns';

import { isDate } from './date-utils';

interface Props {
  label: string;
  value: Date | string;
}

export const Selected = ({ label, value }: Props) => {
  return (
    <div>
      <span className="text-xs text-light-muted">{label}: </span>
      <span>{isDate(value) ? format(value, 'yyyy-MM-dd') : value}</span>
    </div>
  );
};

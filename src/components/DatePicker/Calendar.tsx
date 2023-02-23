/* eslint-disable max-lines-per-function */
import {
  addMonths,
  eachDayOfInterval,
  nextSunday,
  previousMonday,
  startOfMonth,
} from 'date-fns';
import { useMemo } from 'react';

import { Days } from './Days';
import { Weekdays } from './Weekdays';

interface Props {
  value: Date;
  startFrom: Date;
  onSelect?: (date: Date) => void;
}

export const Calendar = ({ value, startFrom, onSelect }: Props) => {
  const days = useMemo(() => {
    const start = previousMonday(startOfMonth(startFrom));
    const end = nextSunday(startOfMonth(addMonths(startFrom, 1)));
    return eachDayOfInterval({ start, end });
  }, [startFrom]);

  return (
    <div className="bg-dark-1 px-5 py-3">
      <Weekdays />
      <Days value={value} days={days} onSelect={onSelect} />
    </div>
  );
};

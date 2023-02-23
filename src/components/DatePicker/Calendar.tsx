/* eslint-disable max-lines-per-function */
import {
  addMonths,
  eachDayOfInterval,
  nextSunday,
  previousMonday,
  startOfMonth,
} from 'date-fns';
import { useMemo } from 'react';

import { DateGrid } from './DateGrid';
import { Days } from './Days';
import { MonthItem } from './MonthItem';
import { Weekdays } from './Weekdays';

interface Props {
  value: Date;
  startFrom: Date;
  onSelect?: (date: Date) => void;
}

export const Calendar = ({ value, startFrom, onSelect }: Props) => {
  const start = previousMonday(startOfMonth(startFrom));
  const end = nextSunday(startOfMonth(addMonths(startFrom, 1)));
  const days = useMemo(() => eachDayOfInterval({ start, end }), [end, start]);

  return (
    <div className="flex flex-col items-center gap-2 rounded border border-border bg-dark-1 px-5 py-3">
      <MonthItem value={value} />
      <DateGrid>
        <Weekdays />
        <Days value={value} days={days} onSelect={onSelect} />
      </DateGrid>
    </div>
  );
};

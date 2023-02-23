import {
  format as formatDate,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  isWeekend,
  startOfMonth,
} from 'date-fns';

import { startOfNextMonth } from './date-utils';
import { DateGrid } from './DateGrid';
import { DateItem } from './DateItem';

interface Props {
  value: Date;
  days: Date[];
  onSelect?: (day: Date) => void;
}

export const Days = ({ value, days, onSelect }: Props) => {
  return (
    <DateGrid>
      {days.map((day) => (
        <DateItem
          key={day.valueOf()}
          isActive={isWeekend(day)}
          isSelected={isSameDay(day, value)}
          isToday={isToday(day)}
          isMuted={
            isBefore(day, startOfMonth(value)) ||
            isAfter(day, startOfNextMonth(value))
          }
          onClick={() => onSelect?.(day)}
        >
          {formatDate(day, 'dd')}
        </DateItem>
      ))}
    </DateGrid>
  );
};

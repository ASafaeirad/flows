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
import { DateItem } from './DateItem';

interface Props {
  value: Date;
  days: Date[];
  onSelect?: (day: Date) => void;
}

export const Days = ({ value, days, onSelect }: Props) => {
  return (
    <>
      {days.map((day) => (
        <DateItem
          key={day.valueOf()}
          onPress={() => onSelect?.(day)}
          isActive={isWeekend(day)}
          isSelected={isSameDay(day, value)}
          isToday={isToday(day)}
          isMuted={
            isBefore(day, startOfMonth(value)) ||
            isAfter(day, startOfNextMonth(value))
          }
        >
          {formatDate(day, 'dd')}
        </DateItem>
      ))}
    </>
  );
};

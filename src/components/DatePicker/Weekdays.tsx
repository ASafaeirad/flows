import { DateItem } from './DateItem';

const weekDays = [
  { day: 'Mo', isWeekend: false },
  { day: 'Tu', isWeekend: false },
  { day: 'We', isWeekend: false },
  { day: 'Th', isWeekend: false },
  { day: 'Fr', isWeekend: false },
  { day: 'Sa', isWeekend: true },
  { day: 'Su', isWeekend: true },
] as const;

export const Weekdays = () => {
  return (
    <>
      {weekDays.map(({ day, isWeekend }) => (
        <DateItem key={day} isLabel isActive={isWeekend}>
          {day}
        </DateItem>
      ))}
    </>
  );
};

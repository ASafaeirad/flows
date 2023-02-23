import { format } from 'date-fns';
import { useRef } from 'react';

import { Input } from '../Input';
import { useControlled } from '../useControlled';
import { Calendar } from './Calendar';

interface Props {
  value?: Date;
  onChange?: (value: Date, e?: HTMLInputElement) => void;
  startFrom?: Date;
  dateFormat?: string;
  dayFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  onSelect?: (date: Date) => void;
}

const today = new Date();

export const DatePicker = ({
  onChange,
  startFrom = today,
  dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
  disabledDates,
  onSelect,
  ...props
}: Props) => {
  const [value, setValue] = useControlled<Date>({
    controlled: props.value,
    default: today,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (date: Date) => {
    setValue(date);
    onSelect?.(date);
  };

  return (
    <div className="relative flex flex-col gap-3">
      <Input ref={inputRef} value={format(value, dateFormat)} />
      <Calendar startFrom={startFrom} value={value} onSelect={handleSelect} />
    </div>
  );
};

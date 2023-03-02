import { addDays, addWeeks, format } from 'date-fns';
import { forwardRef, useRef, useState } from 'react';

import { Input } from '../Input';
import { useForkRef } from '../useForkRef';
import { Calendar } from './Calendar';

interface Props {
  dateFormat?: string;
  onSelect?: (date: Date) => void;
  defaultValue?: Date;
  placeholder?: string;
}

const today = new Date();

export const DatePicker = forwardRef<HTMLInputElement, Props>(
  (
    { dateFormat = 'yyyy-MM-dd', onSelect, defaultValue = today, placeholder },
    ref,
  ) => {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleRef = useForkRef(ref, inputRef);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'ArrowDown') setValue(addWeeks(value, 1));
      if (e.key === 'k' || e.key === 'ArrowUp') setValue(addWeeks(value, -1));
      if (e.key === 'l' || e.key === 'ArrowRight') setValue(addDays(value, 1));
      if (e.key === 'h' || e.key === 'ArrowLeft') setValue(addDays(value, -1));
      if (e.key === 'd') setValue(today);
      if (e.key === 'Enter') onSelect?.(value);
    };

    return (
      <div className="relative flex flex-col gap-3">
        <Input
          onKeyDown={handleKeyDown}
          ref={handleRef}
          value={format(value, dateFormat)}
          placeholder={placeholder}
        />
        <Calendar startFrom={value} value={value} onSelect={onSelect} />
      </div>
    );
  },
);

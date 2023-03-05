import { isEmpty } from '@fullstacksjs/toolbox';
import { forwardRef, Fragment, useState } from 'react';

import { useFilter } from '../hooks';
import { Input } from './Input';
import { Separator } from './Separator';

interface Props<T = string> {
  items: T[];
  label: string;
  placeholder?: string;
  onSelect?: (item: T) => void;
  getLabel?: (x: T) => string;
  getId?: (x: T) => string;
}

export const Select = forwardRef<HTMLInputElement, Props>(
  (
    { items, label, placeholder, onSelect, getLabel = String, getId = String },
    ref,
  ) => {
    const [value, setValue] = useState('');
    const { filteredItems, selectedIndex, setSelected } = useFilter(
      items,
      value,
      getLabel,
    );

    const handleKeyDown = (e: KeyboardEvent | React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => s + 1);
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => s - 1);
      }

      if (e.key === 'j' && e.ctrlKey) {
        e.preventDefault();
        setSelected((s) => s + 1);
      }

      if (e.key === 'k' && e.ctrlKey) {
        e.preventDefault();
        setSelected((s) => s - 1);
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const item = filteredItems[selectedIndex];
        if (item) onSelect?.(item);
      }
    };

    return (
      <div className="flex flex-col gap-3">
        <Input
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          ref={ref}
        />
        <div className="bg-bg-700 flex flex-col gap-2 rounded border border-border py-3 px-5">
          <div className="text-sm text-light-muted">{label}</div>
          {isEmpty(filteredItems) ? (
            <div className="text-light-muted">No Item</div>
          ) : (
            filteredItems.map((item, index) => (
              <Fragment key={getId(item)}>
                <div
                  className={
                    selectedIndex === index ? 'text-accent-0' : undefined
                  }
                >
                  {getLabel(item)}
                </div>
                {index < filteredItems.length - 1 && <Separator />}
              </Fragment>
            ))
          )}
        </div>
      </div>
    );
  },
) as <T>(
  props: Props<T> & { ref?: React.LegacyRef<HTMLInputElement> },
) => JSX.Element;

import { isEmpty } from '@fullstacksjs/toolbox';
import { forwardRef, Fragment, useRef, useState } from 'react';

import { useFilter, useForkRef } from '../hooks';
import { type InputProps } from './Input';
import { Input } from './Input';
import { Separator } from './Separator';

interface Props<T = string> extends Omit<InputProps, 'onSelect' | 'ref'> {
  items: T[];
  label: string;
  placeholder?: string;
  onSelect?: (item: T) => void;
  getLabel?: (x: T) => string;
  getId?: (x: T) => string;
  onNewEntry?: (newScript: string) => void;
}

export const Select = forwardRef<HTMLInputElement, Props>(
  (
    {
      items,
      label,
      placeholder,
      onSelect,
      getLabel = String,
      getId = String,
      onNewEntry,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { filteredItems, selectedIndex, setSelected } = useFilter(
      items,
      value,
      getLabel,
    );

    const handleRef = useForkRef(ref, inputRef);
    const isNewItem =
      isEmpty(filteredItems) && onNewEntry && inputRef.current?.value;

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

        if (isNewItem) {
          onNewEntry(inputRef.current.value);
          return;
        }

        const item = filteredItems[selectedIndex];
        if (item) onSelect?.(item);
      }
    };

    return (
      <div className="flex flex-col gap-3">
        <Input
          {...props}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          ref={handleRef}
        />
        <div className="bg-bg-700 flex flex-col gap-2 rounded border border-border py-3 px-5">
          <div className="text-sm text-light-muted">{label}</div>
          {isEmpty(filteredItems) ? (
            isNewItem ? (
              <div className="text-light-muted">
                Add{' '}
                <span className="text-accent-0">{inputRef.current.value}</span>
              </div>
            ) : (
              <div className="text-light-muted">No Item</div>
            )
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

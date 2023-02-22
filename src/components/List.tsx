import { clamp } from '@fullstacksjs/toolbox';
import { Fragment, useEffect, useState } from 'react';

import { Input } from './Input';
import { Separator } from './Separator';

export const Select = ({
  items,
  label,
  placeholder,
}: {
  items: string[];
  label: string;
  placeholder?: string;
}) => {
  const [selectedIndex, innerSetSelectedIndex] = useState(0);

  const [value, setValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  const setSelected = (cb: (n: number) => number) => {
    innerSetSelectedIndex((n) => {
      const next = cb(n);
      return clamp(next, { min: 0, max: filteredItems.length - 1 });
    });
  };

  useEffect(() => {
    setFilteredItems(
      items.filter((i) =>
        i.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
      ),
    );
  }, [items, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelected((s) => s + 1);
      e.preventDefault();
    }

    if (e.key === 'ArrowUp') {
      setSelected((s) => s - 1);
      e.preventDefault();
    }

    if (e.key === 'j' && e.ctrlKey) {
      setSelected((s) => s + 1);
      e.preventDefault();
    }

    if (e.key === 'k' && e.ctrlKey) {
      setSelected((s) => s - 1);
      e.preventDefault();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} className="flex flex-col gap-3">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex flex-col gap-2 rounded border border-white/10 bg-bg-700 py-3 px-5">
        <div className="text-sm text-white/20">{label}</div>
        {filteredItems.map((item, index) => (
          <Fragment key={item}>
            <div
              className={
                selectedIndex === index ? 'text-yellow-500' : undefined
              }
            >
              {item}
            </div>
            {index <= item.length && <Separator />}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

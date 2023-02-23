import { clamp } from '@fullstacksjs/toolbox';
import { useCallback, useEffect, useState } from 'react';

export const useFilter = <T>(
  items: T[],
  value: string,
  getLabel: (x: T) => string,
) => {
  const [selectedIndex, innerSetSelectedIndex] = useState(0);
  const [filteredItems, setFilteredItems] = useState(items);

  const setSelected = useCallback(
    (cb: (n: number) => number) => {
      innerSetSelectedIndex((n) => {
        const next = cb(n);
        return clamp(next, { min: 0, max: filteredItems.length - 1 });
      });
    },
    [filteredItems.length],
  );
  useEffect(() => {
    const nextItems = items.filter((i) =>
      getLabel(i).toLocaleLowerCase().includes(value.toLocaleLowerCase()),
    );
    setFilteredItems(nextItems);
    if (selectedIndex > nextItems.length - 1) setSelected((c) => c);
  }, [getLabel, items, selectedIndex, setSelected, value]);

  return { setSelected, filteredItems, selectedIndex };
};

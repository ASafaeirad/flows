import { useCallback, useRef, useState } from 'react';

export interface UseControlledProps<T = unknown> {
  controlled: T;
  default: T | undefined;
  name: string;
  state?: string;
}

type Setter<T> = T | ((prevValue: T) => T);

export function useControlled<T = unknown>({
  controlled,
  default: defaultProp,
}: UseControlledProps<T>): readonly [T, (s: Setter<T>) => void] {
  const { current: isControlled } = useRef(controlled !== undefined);
  // @ts-expect-error It can be undefined :)
  const [valueState, setValue] = useState<T>(defaultProp);
  const value = isControlled ? controlled : valueState;

  const setValueIfUncontrolled = useCallback((newValue: Setter<T>) => {
    if (!isControlled) setValue(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, setValueIfUncontrolled] as const;
}

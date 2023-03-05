import { invoke } from '@tauri-apps/api';
import { forwardRef, useEffect, useState } from 'react';

import { getScripts } from '../Dto';
import { Select } from './List';

interface Props {
  onSelect: (script: string) => void;
}

export const SelectScript = forwardRef<HTMLInputElement, Props>(
  ({ onSelect }, ref) => {
    const [scripts, setScripts] = useState<string[]>([]);

    useEffect(() => {
      invoke('get_scripts')
        .then(getScripts)
        .then(setScripts)
        .catch(console.error);
    }, []);

    return (
      <Select
        label="Scripts"
        ref={ref as React.RefObject<HTMLInputElement>}
        items={scripts}
        onSelect={onSelect}
        placeholder="Select Script"
      />
    );
  },
);

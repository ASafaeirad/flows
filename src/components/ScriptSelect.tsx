import { invoke } from '@tauri-apps/api';
import { forwardRef, useEffect, useState } from 'react';

import { getScripts } from '../Dto';
import { Select } from './List';

interface Props {
  onSelect: (script: SelectItem) => void;
}

export interface SelectItem {
  label: string;
  value: string;
}

export const SelectScript = forwardRef<HTMLInputElement, Props>(
  ({ onSelect }, ref) => {
    const [scripts, setScripts] = useState<SelectItem[]>([]);

    const createScript = (item: string) => {
      console.log(item);
    };

    useEffect(() => {
      invoke('get_scripts')
        .then(getScripts)
        .then(setScripts)
        .catch(console.error);
    }, []);

    return (
      <Select<SelectItem>
        onNewEntry={createScript}
        label="Scripts"
        autoFocus
        ref={ref}
        items={scripts}
        getLabel={(v) => v.label}
        onSelect={onSelect}
        placeholder="Select Script"
      />
    );
  },
);

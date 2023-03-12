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

    const createScript = (name: string) => {
      invoke('create_script', { name }).then(console.log).catch(console.error);
    };

    const editScript = (item: SelectItem) => {
      invoke('edit_script', { name: item.value })
        .then(console.log)
        .catch(console.error);
    };

    const syncScripts = () => {
      invoke('get_scripts')
        .then(getScripts)
        .then(setScripts)
        .catch(console.error);
    };

    useEffect(() => {
      syncScripts();
    }, []);

    return (
      <Select<SelectItem>
        onNewEntry={createScript}
        onEdit={editScript}
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

import { invoke } from '@tauri-apps/api';
import { forwardRef, useEffect, useState } from 'react';

import { toScripts } from '../Dto';
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

    const syncScripts = () => {
      invoke('get_scripts')
        .then(toScripts)
        .then(setScripts)
        .catch(console.error);
    };

    const createScript = (name: string) => {
      invoke('create_script', { name }).then(syncScripts).catch(console.error);
    };

    const editScript = (item: SelectItem) => {
      invoke('edit_script', { name: item.value })
        .then(console.log)
        .catch(console.error);
    };

    const deleteScript = (item: SelectItem) => {
      console.log(item);
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
        onDelete={deleteScript}
        placeholder="Select Script"
      />
    );
  },
);

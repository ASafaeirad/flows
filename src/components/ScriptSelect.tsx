import { invoke } from '@tauri-apps/api';
import { forwardRef, useEffect, useState } from 'react';

import { toScripts } from '../Dto';
import { DeleteConfirm } from './DeleteConfirm';
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
    const [scriptToDelete, setScriptToDelete] = useState<string>();

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

    const deleteScript = () => {
      invoke('delete_script', { name: scriptToDelete })
        .then(syncScripts)
        .catch(console.error);
      setScriptToDelete(undefined);
    };

    const handleDelete = (item: SelectItem) => {
      setScriptToDelete(item.value);
    };

    const cancel = () => {
      setScriptToDelete(undefined);
    };

    useEffect(() => {
      syncScripts();
    }, []);

    return scriptToDelete ? (
      <DeleteConfirm onCancel={cancel} onConfirm={deleteScript}>
        Do you want to delete &quot;{scriptToDelete}&quot;?
      </DeleteConfirm>
    ) : (
      <Select<SelectItem>
        onNewEntry={createScript}
        onEdit={editScript}
        label="Scripts"
        autoFocus
        ref={ref}
        items={scripts}
        getLabel={(v) => v.label}
        getId={(v) => v.value}
        onSelect={onSelect}
        onDelete={handleDelete}
        placeholder="Select Script"
      />
    );
  },
);

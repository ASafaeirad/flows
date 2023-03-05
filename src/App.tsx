import { invoke } from '@tauri-apps/api';
import { useState } from 'react';

import { type Prompt } from './components/Prompt';
import { Prompts } from './components/Prompts';
import { type SelectItem } from './components/ScriptSelect';
import { SelectScript } from './components/ScriptSelect';
import { toClientPrompt } from './Dto';

type Mode = 'prompt' | 'script';

const App = () => {
  const [state, setState] = useState<Mode>('script');
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const selectScript = (script: SelectItem) => {
    invoke('select_script', { name: script.value })
      .then(toClientPrompt)
      .then((p) => {
        setPrompts(p);
        setState('prompt');
      })
      .catch(console.error);
  };

  return (
    <div className="flex w-96 flex-col gap-3 rounded-lg bg-dark-0 p-5 text-light-0">
      {state === 'script' ? (
        <SelectScript onSelect={selectScript} />
      ) : (
        <Prompts prompts={prompts} />
      )}
    </div>
  );
};

export default App;

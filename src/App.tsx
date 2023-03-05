import { isNull } from '@fullstacksjs/toolbox';
import { invoke } from '@tauri-apps/api';
import { useState } from 'react';

import { type Prompt } from './components/Prompt';
import { Prompts } from './components/Prompts';
import { type SelectItem } from './components/ScriptSelect';
import { SelectScript } from './components/ScriptSelect';
import { toClientPrompt } from './Dto';

const App = () => {
  const [script, setScript] = useState<string | undefined>();
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const selectScript = ({ value }: SelectItem) => {
    invoke('select_script', { name: value })
      .then(toClientPrompt)
      .then((p) => {
        setPrompts(p);
        setScript(value);
      })
      .catch(console.error);
  };

  const handleSuccess = (data: unknown) => {
    console.log(data);
    setScript(undefined);
  };

  const handleError = (error: unknown) => {
    console.log(error);
    setScript(undefined);
  };

  return (
    <div className="flex w-96 flex-col gap-3 rounded-lg bg-dark-0 p-5 text-light-0">
      {isNull(script) ? (
        <SelectScript onSelect={selectScript} />
      ) : (
        <Prompts
          onSuccess={handleSuccess}
          onError={handleError}
          script={script}
          prompts={prompts}
        />
      )}
    </div>
  );
};

export default App;

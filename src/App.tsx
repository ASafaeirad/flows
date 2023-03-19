import { isNull } from '@fullstacksjs/toolbox';
import { invoke } from '@tauri-apps/api';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { useCallback, useEffect, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

import { type Prompt } from './components/Prompt';
import { Prompts } from './components/Prompts';
import { type SelectItem } from './components/ScriptSelect';
import { SelectScript } from './components/ScriptSelect';
import { toClientPrompt } from './Dto';
import { useElementSize } from './hooks/useElementSize';

const App = () => {
  const [script, setScript] = useState<string | undefined>();
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEventListener('keydown', (e) => {
    const key = e.key as KeyboardEventKey;

    if (key === 'E' && e.shiftKey && e.ctrlKey) {
      e.preventDefault();
      invoke('edit_flows').catch(console.error);
    }
  });

  const selectScript = ({ value }: SelectItem) => {
    invoke('select_script', { name: value })
      .then(toClientPrompt)
      .then((p) => {
        setPrompts(p);
        setScript(value);
      })
      .catch(console.error);
  };

  const handleSuccess = () => {
    setScript(undefined);
  };

  const handleError = (error: unknown) => {
    console.error(error);
    setScript(undefined);
  };

  const { ref, height, width } = useElementSize();

  const resize = useCallback(async () => {
    try {
      if (width > 0 && height > 0) {
        await appWindow.setSize(new LogicalSize(width, height));
      }
    } catch (e) {
      return console.error(e);
    }
  }, [height, width]);

  useEffect(() => {
    void resize();
    appWindow.center().catch(console.error);
  }, [resize]);

  return (
    <div ref={ref}>
      <div className="flex min-w-[32rem] flex-col gap-3 overflow-hidden rounded-lg p-5 text-light-0">
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
    </div>
  );
};

export default App;

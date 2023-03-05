/* eslint-disable fp/no-let */

import { isNull, isString } from '@fullstacksjs/toolbox';
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { Fragment, useEffect, useReducer, useRef, useState } from 'react';

import { Button } from './components/Button';
import { Select } from './components/List';
import { type Prompt, PromptInput } from './components/Prompt';
import { Selected } from './components/Selected';
import { Separator } from './components/Separator';
import { toClientPrompt } from './ServerPrompt';

type Result = Record<string, Date | string>;
type PolyEvent =
  | React.KeyboardEvent<HTMLButtonElement>
  | React.MouseEvent<HTMLButtonElement>;

const App = () => {
  const ref = useRef<HTMLButtonElement | HTMLInputElement>(null);
  const [state, setState] = useState<'prompt' | 'script'>('script');
  const [scripts, setScripts] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useReducer(
    (prev: Result, next: Result) => ({ ...prev, ...next }),
    {},
  );

  useEffect(() => {
    invoke('get_scripts')
      .then((x) => {
        if (!isString(x)) throw Error('not string');
        const next = x.split(',');
        setScripts(next);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      ref.current?.focus();
    }, 100);
  }, [step]);

  const handleSubmit = (config: Prompt, value: Date | string) => {
    setResults({ [config.key]: value });
    setStep((c) => (c += 1));
  };

  const run = (e: PolyEvent) => {
    if ('key' in e && e.key !== 'Enter') return;

    setLoading(true);
    setTimeout(() => {
      invoke('run', { args: JSON.stringify(results) })
        .then(() => appWindow.hide())
        .catch(console.error)
        .finally(() => {
          setLoading(false);
        });
    }, 100);
  };

  const currentPrompt = prompts[step];

  const selectScript = (script: string) => {
    invoke('select_script', { name: script })
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
        <Select
          label="Scripts"
          ref={ref as React.RefObject<HTMLInputElement>}
          items={scripts}
          onSelect={selectScript}
        />
      ) : (
        <>
          {prompts.map((prompt, i) => {
            const value = results[prompt.key];
            const haveResult = i < step && !isNull(value);
            return haveResult ? (
              <Fragment key={prompt.key}>
                <Selected label={prompt.label} value={value} />
                <Separator />
              </Fragment>
            ) : null;
          })}

          {!isNull(currentPrompt) ? (
            <PromptInput
              ref={ref as React.RefObject<HTMLInputElement>}
              {...currentPrompt}
              onSelect={(e) => handleSubmit(currentPrompt, e)}
            />
          ) : (
            <Button
              ref={ref as React.RefObject<HTMLButtonElement>}
              onKeyDown={run}
              onClick={run}
            >
              {loading ? '...' : 'Run'}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default App;

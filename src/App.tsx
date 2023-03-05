/* eslint-disable fp/no-let */

import { isNull } from '@fullstacksjs/toolbox';
import { usePress } from '@react-aria/interactions';
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { Fragment, useEffect, useReducer, useRef, useState } from 'react';

import { Button } from './components/Button';
import {
  type DatePrompt,
  type Prompt,
  PromptInput,
  type SelectPrompt,
  type TextPrompt,
} from './components/Prompt';
import { Selected } from './components/Selected';
import { Separator } from './components/Separator';

interface TextServerPrompt {
  readonly label: [string];
  readonly key: [string];
  readonly type: ['Text'];
  readonly defaultValue: [string];
}
interface SelectServerPrompt {
  readonly type: ['Select'];
  readonly key: [string];
  readonly label: [string];
  readonly items: [string];
}
interface DateServerPrompt {
  readonly label: [string];
  readonly type: ['Date'];
  readonly defaultValue: [string];
  readonly key: [string];
}

type ServerPrompt = DateServerPrompt | SelectServerPrompt | TextServerPrompt;

let prompts: Prompt[] = [];

invoke('init')
  .then((raw) => {
    const serverPrompts = JSON.parse(raw as string) as readonly ServerPrompt[];
    prompts = serverPrompts
      .map<Prompt | undefined>((p) => {
        if (p.type[0] === 'Date')
          return {
            key: p.key[0],
            label: p.label[0],
            type: 'Date',
          } as DatePrompt;
        if (p.type[0] === 'Select')
          return {
            key: p.key[0],
            label: p.label[0],
            // @ts-expect-error
            items: p.items,
            type: 'Select',
          } as SelectPrompt;
        if (p.type[0] === 'Text')
          return {
            key: p.key[0],
            label: p.label[0],
            // @ts-expect-error
            defaultValue: p.defaultValue?.[0],
            type: 'Text',
          } as TextPrompt;
        return undefined;
      })
      .filter(Boolean);
    console.log(prompts);
  })
  .catch(console.error);

type Result = Record<string, Date | string>;

const App = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useReducer(
    (prev: Result, next: Result) => ({ ...prev, ...next }),
    {},
  );
  const ref = useRef<HTMLButtonElement | HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [step]);

  const handleSubmit = (config: Prompt, value: Date | string) => {
    setResults({ [config.key]: value });
    setStep((c) => (c += 1));
  };

  const run = (
    e:
      | React.KeyboardEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
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

  return (
    <div className="flex w-96 flex-col gap-3 rounded-lg bg-dark-0 p-5 text-light-0">
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
    </div>
  );
};

export default App;

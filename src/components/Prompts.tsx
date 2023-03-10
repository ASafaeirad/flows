import { isNull } from '@fullstacksjs/toolbox';
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { Fragment, useEffect, useReducer, useRef, useState } from 'react';

import { Button } from './Button';
import { type Prompt, PromptInput } from './Prompt';
import { Selected } from './Selected';
import { Separator } from './Separator';

type PolyEvent =
  | React.KeyboardEvent<HTMLButtonElement>
  | React.MouseEvent<HTMLButtonElement>;

interface Props {
  prompts: Prompt[];
  script: string;
  onSuccess: (data: unknown) => void;
  onError: (data: unknown) => void;
}

type Result = Record<string, Date | string>;

export const Prompts = ({
  prompts,
  script,
  onError,
  onSuccess,
}: Props): JSX.Element => {
  const ref = useRef<HTMLButtonElement | HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useReducer(
    (prev: Result, next: Result) => ({ ...prev, ...next }),
    {},
  );

  useEffect(() => {
    setTimeout(() => {
      ref.current?.focus();
    }, 100);
  }, [step]);

  const handleSubmit = (config: Prompt, value: Date | string) => {
    setResults({ [config.key]: value });
    setStep((c) => (c += 1));
  };

  const run = async (e: PolyEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    setLoading(true);

    try {
      const args = JSON.stringify(results);
      const data = await invoke('run', { script, args });
      await appWindow.hide();
      onSuccess(data);
    } catch (error) {
      setLoading(false);
      onError(error);
    }
  };

  const currentPrompt = prompts[step];

  return (
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
  );
};

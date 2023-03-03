import { isNull } from '@fullstacksjs/toolbox';
import { usePress } from '@react-aria/interactions';
import { Fragment, useEffect, useReducer, useRef, useState } from 'react';

import { Button } from './components/Button';
import { type Prompt, PromptInput } from './components/Prompt';
import { Selected } from './components/Selected';
import { Separator } from './components/Separator';

const x: Prompt = {
  key: 'name',
  label: 'Label',
  type: 'Text',
  required: true,
};
const y: Prompt = {
  key: 'select',
  label: 'Label',
  type: 'Select',
  items: ['A', 'B'],
  required: false,
  defaultValue: '5',
};
const d: Prompt = {
  key: 'date',
  label: 'Label',
  type: 'Date',
  required: false,
};

const prompts = [x, y, d];

type Result = Record<string, Date | string>;

const App = () => {
  const [step, setStep] = useState(0);
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

  const { pressProps } = usePress({
    onPress: () => {
      console.log(results);
    },
  });

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
        <Button ref={ref as React.RefObject<HTMLButtonElement>} {...pressProps}>
          Run
        </Button>
      )}
    </div>
  );
};

export default App;

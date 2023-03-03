import { isLastIndex, isNull } from '@fullstacksjs/toolbox';
import { Fragment, useRef, useState } from 'react';

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

const configs = [x, y, d];

const App = () => {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<Record<string, Date | string>>({});
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit = (config: Prompt, value: Date | string) => {
    setResults((r) => ({
      ...r,
      [config.key]: value,
    }));
    setStep((c) => (c += 1));
    setTimeout(() => {
      ref.current?.focus();
    }, 0);
  };

  const config = configs[step];

  return (
    <div className="flex w-96 flex-col gap-3 rounded-lg bg-dark-0 p-5 text-light-0">
      {configs.map((c, i) => {
        const value = results[c.key];
        if (i < step && !isNull(value))
          return (
            <Fragment key={c.key}>
              <Selected label={c.label} value={value} />
              {!isLastIndex(configs, i) && <Separator />}
            </Fragment>
          );

        return null;
      })}
      {!isNull(config) ? (
        <PromptInput
          ref={ref}
          {...config}
          onSelect={(e) => handleSubmit(config, e)}
        />
      ) : null}
    </div>
  );
};

export default App;

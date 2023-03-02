/* eslint-disable react/no-array-index-key */
import { isLastIndex, isNull } from '@fullstacksjs/toolbox';
import { Fragment, useRef, useState } from 'react';

import { Prompt, type PromptT } from './components/Prompt';
import { Selected } from './components/Selected';
import { Separator } from './components/Separator';

const x: PromptT = { label: 'Label', type: 'Text', required: true };
const y: PromptT = {
  label: 'Label',
  type: 'Select',
  items: ['A', 'B'],
  required: false,
  defaultValue: '5',
};
const d: PromptT = {
  label: 'Label',
  type: 'Date',
  required: false,
};

const configs: PromptT[] = [x, y, d];

const App = () => {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState(new Map());
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit = (config: PromptT, value: Date | string) => {
    setResults(results.set(config, value));
    setStep((c) => (c += 1));
    setTimeout(() => {
      ref.current?.focus();
    }, 0);
  };

  const config = configs[step];

  return (
    <div className="flex w-96 flex-col gap-3 rounded-lg bg-dark-0 p-5 text-light-0">
      {configs.map((c, i) => {
        console.log(results, results.get(c));

        if (i < step)
          return (
            <Fragment key={i}>
              <Selected label={c.label} value={results.get(c)} />
              {!isLastIndex(configs, i) && <Separator />}
            </Fragment>
          );

        return null;
      })}
      {!isNull(config) ? (
        <Prompt
          ref={ref}
          {...config}
          onSelect={(e) => handleSubmit(config, e)}
        />
      ) : null}
    </div>
  );
};

export default App;

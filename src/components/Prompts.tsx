import { isNull } from '@fullstacksjs/toolbox';
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
} from 'react';

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
type Action =
  | { type: 'Revert' }
  | { type: 'Submit'; key: string; value: Date | string };
interface State {
  step: number;
  results: Result;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'Submit':
      return {
        results: { ...state.results, [action.key]: action.value },
        step: state.step + 1,
      };
    case 'Revert':
      return { ...state, step: Math.max(state.step - 1, 0) };
    default:
      return state;
  }
}

const initialState = {
  step: 0,
  results: {},
};

export interface PromptRef {
  revert: () => number;
}

export const Prompts = forwardRef<PromptRef, Props>(
  ({ prompts, script, onError, onSuccess }, ref) => {
    const inputRef = useRef<HTMLButtonElement | HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [{ results, step }, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, [step]);

    useImperativeHandle(ref, () => {
      return {
        revert: () => {
          dispatch({ type: 'Revert' });
          return step;
        },
      };
    });

    const handleSubmit = (config: Prompt, value: Date | string) => {
      dispatch({ type: 'Submit', key: config.key, value });
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
            ref={inputRef as React.RefObject<HTMLInputElement>}
            {...currentPrompt}
            onSelect={(e) => handleSubmit(currentPrompt, e)}
          />
        ) : (
          <Button
            ref={inputRef as React.RefObject<HTMLButtonElement>}
            onClick={run}
          >
            {loading ? '...' : 'Run'}
          </Button>
        )}
      </>
    );
  },
);

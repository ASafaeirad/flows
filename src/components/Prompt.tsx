import { forwardRef } from 'react';

import { DatePicker } from './DatePicker';
import { Input } from './Input';
import { Select } from './List';

interface PromptProps {
  label: string;
  key: string;
}

type PromptAttributes<T> =
  | { required: false; defaultValue?: T }
  | { required: true };

export type SelectPrompt = PromptAttributes<string> &
  PromptProps & {
    type: 'Select';
    items: string[];
  };

export type DatePrompt = PromptAttributes<Date> &
  PromptProps & {
    type: 'Date';
  };

export type TextPrompt = PromptAttributes<string> &
  PromptProps & {
    type: 'Text';
  };

export type Prompt = DatePrompt | SelectPrompt | TextPrompt;

type Props = Prompt & {
  onSelect: (e: Date | string) => void;
};

export const PromptInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  if (props.type === 'Date')
    return (
      <DatePicker
        ref={ref}
        onSelect={(e) => props.onSelect(e)}
        placeholder={props.label}
      />
    );

  if (props.type === 'Select')
    return (
      <Select
        ref={ref}
        onSelect={(e) => props.onSelect(e)}
        label={props.label}
        items={props.items}
        placeholder={props.label}
      />
    );

  return (
    <Input
      ref={ref}
      onSelect={(e) => props.onSelect(e)}
      placeholder={props.label}
    />
  );
});

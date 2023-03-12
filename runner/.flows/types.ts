interface PromptProps {
  label: string;
}

type PromptAttributes<T> =
  | { required: false; defaultValue?: T }
  | { required?: true };

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

export const prompt = {
  text(p: Omit<TextPrompt, 'type'>): TextPrompt {
    return { ...p, type: 'Text' };
  },
  date(p: Omit<DatePrompt, 'type'>): DatePrompt {
    return { ...p, type: 'Date' };
  },
  select(p: Omit<SelectPrompt, 'type'>): SelectPrompt {
    return { ...p, type: 'Select' };
  },
};

export type Values<T> = {
  [key in keyof T]: string;
};

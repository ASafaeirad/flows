import { isString } from '@fullstacksjs/toolbox';

import { type Prompt } from './components/Prompt';

type ServerPrompt = Record<string, Prompt>;

export function toClientPrompt(raw: unknown): Prompt[] {
  if (!isString(raw)) throw Error(`${raw} does not exit`);
  const serverPrompts = JSON.parse(raw) as ServerPrompt[];
  return (
    Object.entries(serverPrompts)
      // @ts-ignore
      .map<Prompt | undefined>(([key, p]) => ({ ...p, key }))
      .filter(Boolean)
  );
}

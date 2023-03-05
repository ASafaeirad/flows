import { isString } from '@fullstacksjs/toolbox';

import { type Prompt } from './components/Prompt';

type ServerPrompt = Record<string, Prompt>;

export function toClientPrompt(raw: unknown): Prompt[] {
  if (!isString(raw)) throw Error(`${raw} does not exit`);
  const serverPrompts = JSON.parse(raw) as ServerPrompt;
  return Object.entries(serverPrompts)
    .map<Prompt | undefined>(([key, p]) => ({ ...p, key }))
    .filter(Boolean);
}

export function getScripts(x: unknown) {
  if (!isString(x)) throw Error('not string');
  const next = x.split(',');
  return next;
}

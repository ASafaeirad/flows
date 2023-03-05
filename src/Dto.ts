import { isString, toCapitalCase } from '@fullstacksjs/toolbox';

import { type Prompt } from './components/Prompt';

type ServerPrompt = Record<string, Prompt>;

export function toClientPrompt(raw: unknown): Prompt[] {
  if (!isString(raw)) throw Error(`${raw} does not exit`);
  const serverPrompts = JSON.parse(raw) as ServerPrompt;
  return Object.entries(serverPrompts)
    .map<Prompt | undefined>(([key, p]) => ({ ...p, key }))
    .filter(Boolean);
}

const toClientLabel = (s: string) => {
  return toCapitalCase(s).split('.')[0];
};

export function getScripts(x: unknown) {
  if (!isString(x)) throw Error('not string');
  const next = x.split(',').map((s) => ({ label: toClientLabel(s), value: s }));
  return next;
}

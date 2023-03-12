import { isString, toCapitalCase } from '@fullstacksjs/toolbox';

import { type Prompt } from './components/Prompt';
import { type SelectItem } from './components/ScriptSelect';

type ServerPrompt = Record<string, Prompt>;

export function toClientPrompt(raw: unknown): Prompt[] {
  if (!isString(raw)) throw Error(`${raw} does not exit`);
  const serverPrompts = JSON.parse(raw) as ServerPrompt;
  return Object.entries(serverPrompts)
    .map<Prompt | undefined>(([key, p]) => ({ ...p, key }))
    .filter(Boolean);
}

const toClientLabel = (s: string) => {
  return toCapitalCase(s).split('.')[0] ?? 'Missing';
};

export function toScripts(x: unknown): SelectItem[] {
  if (!isString(x)) throw Error('not string');

  const next = x
    .split(',')
    .filter(Boolean)
    .map((s) => ({ label: toClientLabel(s), value: s }));

  return next;
}

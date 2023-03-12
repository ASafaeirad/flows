import { prompt, type Values } from './.flows/types.ts';

export const SCHEMA = {};

export const RUN = (values: Values<typeof SCHEMA>) => {
  console.log(values);
};

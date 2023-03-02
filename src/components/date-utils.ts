import { addMonths, isDate as BaseIsDate, startOfMonth } from 'date-fns';

export const startOfNextMonth = (date: Date) =>
  startOfMonth(addMonths(date, 1));

export const isDate = (e: unknown): e is Date => BaseIsDate(e);

import { addMonths, startOfMonth } from 'date-fns';

export const startOfNextMonth = (date: Date) =>
  startOfMonth(addMonths(date, 1));

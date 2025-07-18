import { format } from 'date-fns';

export const formatDate = (date: number | Date, formatStr = 'PPpp') => {
  return format(typeof date === 'number' ? new Date(date) : date, formatStr);
};

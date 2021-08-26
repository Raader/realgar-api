export function extractDate(date?: Date | string | number): {
  day: number;
  month: number;
  year: number;
} {
  const dateToExtract = date ? new Date(date) : new Date();
  const day = dateToExtract.getDate();
  const month = dateToExtract.getMonth();
  const year = dateToExtract.getFullYear();

  return { day, month, year };
}

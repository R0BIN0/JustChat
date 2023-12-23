export const getIndexFromNumber = (num: number): number => (num < 10 ? 0 : Math.floor(num / 10));

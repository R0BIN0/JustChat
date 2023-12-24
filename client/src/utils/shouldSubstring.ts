export const shouldSubstring = (name: string, maxLength: number): string =>
  name.length >= maxLength ? `${name.substring(0, maxLength)}...` : name;

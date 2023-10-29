export const getScrollPercentage = (ref: HTMLElement): number => {
  if (!ref) return 0;
  const { scrollTop, scrollHeight, clientHeight } = ref;
  if (scrollHeight === clientHeight) return 100;
  const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
  return scrollPercentage;
};

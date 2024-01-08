export const scrollToBottom = (ref: HTMLElement, immediate?: boolean): void => {
  if (!ref) return;
  const { scrollHeight, clientHeight } = ref;
  const top = scrollHeight - clientHeight;
  const behavior = immediate ? "instant" : "smooth";
  ref.scrollTo({ top, behavior });
};

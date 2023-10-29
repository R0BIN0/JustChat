export const scrollToBottom = (ref: HTMLElement, immediate?: boolean) => {
  if (!ref) return;
  const { scrollHeight, clientHeight } = ref;
  const top = scrollHeight - clientHeight;
  const behavior = immediate ? "instant" : "smooth";
  ref.scrollTo({ top, behavior });
};

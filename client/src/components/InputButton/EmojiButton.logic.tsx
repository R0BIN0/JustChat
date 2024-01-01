import { EmojiClickData } from "emoji-picker-react";
import { useCallback, useState } from "react";

export const useEmojiButton = (props: { setEmoji: (emoji: string) => void }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  const handleDialog = () => setDialogIsOpen(!dialogIsOpen);

  /**
   * This function is used to handle search input when we search emojis
   * @param {EmojiClickData} e - emoji infos send from "emoji library" that we use
   * @returns {void}
   */
  const onEmojiClick = useCallback((e: EmojiClickData): void => {
    const { emoji } = e;
    props.setEmoji(emoji);
    setDialogIsOpen(false);
  }, []);

  return { dialogIsOpen, handleDialog, onEmojiClick };
};

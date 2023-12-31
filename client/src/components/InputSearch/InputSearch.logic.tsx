import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";

export const useSearchInput = () => {
  const ref = useRef<HTMLInputElement>(null);
  const { isOpen } = useSelector((s: IRootState) => s.dialog);

  useEffect(() => {
    if (isOpen) return;
    window.addEventListener("keypress", handleSearchInputShortCut);
    return () => {
      window.removeEventListener("keypress", handleSearchInputShortCut);
    };
  }, [isOpen]);

  /**
   * This function is used to focus input when shortcut key is pressed
   * @param {KeyboardEvent} e - Keyboard event
   * @returns {void}
   */
  const handleSearchInputShortCut = (e: KeyboardEvent): void => {
    const { code } = e;
    if (code !== "KeyS") return;
    const timeout = setTimeout(() => {
      ref.current?.focus();
      clearTimeout(timeout);
    }, 100);
  };

  return { ref };
};

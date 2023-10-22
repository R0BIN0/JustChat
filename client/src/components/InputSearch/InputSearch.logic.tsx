import { useEffect, useRef } from "react";

export const useSearchInput = () => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.addEventListener("keypress", handleSearchInputShortCut);
    return () => {
      window.removeEventListener("keypress", handleSearchInputShortCut);
    };
  }, []);

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
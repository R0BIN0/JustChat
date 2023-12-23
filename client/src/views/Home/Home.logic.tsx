import { useCallback, useRef } from "react";
import { IHomeRef } from "../../types/Refs/IHomeRef";

export const useHome = () => {
  // Refs
  const homeRef = useRef<IHomeRef>();

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!homeRef.current) return;
    homeRef.current.handleSearchInput(e);
  }, []);

  return { homeRef, handleSearchInput };
};

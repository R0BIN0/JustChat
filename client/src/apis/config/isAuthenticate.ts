import { SESSION_STORAGE_TOKEN } from "../../const/const";

export const isAuthenticate = (): { headers: { "Content-Type": string; Authorization: string } } => {
  const token = sessionStorage.getItem(SESSION_STORAGE_TOKEN);
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

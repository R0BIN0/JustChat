import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";

export const useNavbar = () => {
  const auth = useSelector((s: IRootState) => s.auth);
  return { auth };
};

import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { IRootState } from "../redux/store";
import { SESSION_STORAGE_TOKEN } from "../const/const";

const PrivateRoutes = () => {
  const auth = useSelector((s: IRootState) => s.auth);
  return auth.token && sessionStorage.getItem(SESSION_STORAGE_TOKEN) ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;

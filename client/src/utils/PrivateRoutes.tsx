import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { IRootState } from "../redux/store";

const PrivateRoutes = () => {
    const auth = useSelector((s: IRootState) => s.auth);
    return auth.token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;

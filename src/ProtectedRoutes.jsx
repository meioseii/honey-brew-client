import { Outlet, Navigate } from "react-router-dom";
import useAuthenticationStore from "./store/authentication-store";

const ProtectedRoutes = () => {
  const { isLoggedIn } = useAuthenticationStore();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;

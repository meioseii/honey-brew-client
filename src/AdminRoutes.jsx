import { Outlet, Navigate } from "react-router-dom";
import useAuthenticationStore from "./store/authentication-store";

const AdminRoutes = () => {
  const { isLoggedIn, isAdmin } = useAuthenticationStore();

  if (!isLoggedIn && !isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoutes;

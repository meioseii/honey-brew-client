import Register from "./components/user/Register";
import "./assets/css/main.scss";
import { Route, Routes } from "react-router-dom";
import Login from "./components/user/Login";
import Nav from "./components/user/Navbar";
import Menu from "./components/user/Menu";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminRoutes from "./AdminRoutes";
import Product from "./components/user/Product";
import Cart from "./components/user/Cart";
import Profile from "./components/user/Profile";
import OrderTracker from "./components/user/OrderTracker";
import Orders from "./components/admin/Orders";
import CreateProduct from "./components/admin/CreateProduct";
import UpdateProduct from "./components/admin/UpdateProduct";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route element={<AdminRoutes />}>
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/products" element={<CreateProduct />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/menu/:category/:id" element={<Product />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-tracker" element={<OrderTracker />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        <Route path="/menu/:category" element={<Menu />} />
        <Route index path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/products/:category/:id"
          element={<UpdateProduct />}
        />
      </Routes>
    </>
  );
}

export default App;

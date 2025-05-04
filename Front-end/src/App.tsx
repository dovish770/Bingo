import "./App.css";
import Login from "./pages/login/Login";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/signUp/SignUp";
import PrivateRouteToken from "./PrivateRoute/PrivateRouteToken";
import AllProducts from "./pages/allProducts/AllProducts";
import PrivateRouteAdmin from "./PrivateRoute/PrivateRouteAdmin";
import AdminPage from "./pages/Admin/AdminPage/AdminPage";
import Products from "./pages/Admin/Products/Products";
import Orders from "./pages/Admin/Orders/OrdersPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<SignIn />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/allProducts"
          element={<PrivateRouteToken component={<AllProducts />} />}
        />
        <Route path="/admin" element={<PrivateRouteAdmin component={<AdminPage />} />} />
        <Route path="/admin/products" element={<PrivateRouteAdmin component={<Products />} />} />
        <Route path="/admin/orders" element={<PrivateRouteAdmin component={<Orders />} />} />

      </Routes>
    </>
  );
}

export default App;

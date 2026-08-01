import { Navigate, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import AppPage from "./pages/AppPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/ShopPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

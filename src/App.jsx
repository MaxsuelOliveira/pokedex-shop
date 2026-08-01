import { useEffect, useState } from "react";
import AdminPage from "./pages/AdminPage";
import AppPage from "./pages/AppPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/ShopPage";

const routes = {
  "/": AppPage,
  "/shop": ShopPage,
  "/cart": CartPage,
  "/profile": ProfilePage,
  "/auth": AuthPage,
  "/admin": AdminPage,
};

function getHashPath() {
  return window.location.hash.replace(/^#/, "") || "/";
}

function resolvePath() {
  const path = getHashPath();
  return Object.prototype.hasOwnProperty.call(routes, path) ? path : "/";
}

export default function App() {
  const [path, setPath] = useState(resolvePath);

  useEffect(() => {
    function handleRouteChange() {
      if (!Object.prototype.hasOwnProperty.call(routes, getHashPath())) {
        window.location.replace("#/");
        return;
      }

      setPath(resolvePath());
    }

    handleRouteChange();
    window.addEventListener("hashchange", handleRouteChange);

    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  const Page = routes[path] || AppPage;

  return <Page />;
}

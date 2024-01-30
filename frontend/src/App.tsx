import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/normalPages/HomePage";
import LoginPage from "./pages/normalPages/LoginPage";
import RegisterPage from "./pages/normalPages/RegisterPage";
import PrivateRoute from "./middlewares/PrivateRoute";
import UnauthorizedPage from "./pages/normalPages/UnauthorizedPage";
import AdminUserPage from "./pages/adminPages/AdminUserPage";
import OTPLoginPage from "./pages/normalPages/OTPLoginPage";
import ForgotPasswordPage from "./pages/normalPages/ForgotPasswordPage";
import AdminPromoPage from "./pages/adminPages/AdminPromoPage";
import AddPromoPage from "./pages/adminPages/AddPromoPage";
import AdminHotelPage from "./pages/adminPages/AdminHotelPage";
import PublicRoute from "./middlewares/PublicRoute";
import AddHotelPage from "./pages/adminPages/AddHotelPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login-otp" element={<OTPLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected only admin */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminLayout>
                  <AdminUserPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/hotels"
              element={
                <AdminLayout>
                  <AdminHotelPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/hotels/add"
              element={
                <AdminLayout>
                  <AddHotelPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/promos"
              element={
                <AdminLayout>
                  <AdminPromoPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/promos/add"
              element={
                <AdminLayout>
                  <AddPromoPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/promos/update/:id"
              element={
                <AdminLayout>
                  <AddPromoPage />
                </AdminLayout>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
{
  /* {MENU_LIST.map((menu: IMenu, index) => (
            <Route
              key={index}
              path={menu.path}
              element={
                menu.path === "/register" || menu.path === "/login" ? (
                  <NoLayout>{menu.element}</NoLayout>
                ) : (
                  <MainLayout>{menu.element}</MainLayout>
                )
              }
            />
          ))} */
}

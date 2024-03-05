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
import SendNewsPage from "./pages/adminPages/SendNewsPage";
import AddRoomPage from "./pages/adminPages/AddRoomPage";
import HotelDetailPage from "./pages/normalPages/HotelDetailPage";
import HelpPage from "./pages/normalPages/HelpPage";
import AdvertisementPage from "./pages/normalPages/AdvertisementPage";
import ArticlesPage from "./pages/normalPages/ArticlesPage";
import AboutPage from "./pages/normalPages/AboutPage";
import HotelBookingPage from "./pages/normalPages/HotelBookingPage";
import AuthorizedRoute from "./middlewares/AuthorizedRoute";
import CartPage from "./pages/normalPages/CartPage";
import NormalLayout from "./layouts/NormalLayout";
import BaseLayout from "./layouts/BaseLayout";
import MyOrderPage from "./pages/normalPages/MyOrderPage";
import GamePage from "./pages/normalPages/GamePage";
import AdminFlightPage from "./pages/adminPages/AdminFlightPage";
import AddAirlinePage from "./pages/adminPages/AddAirlinePage";
import AddFlightPage from "./pages/adminPages/AddFlightPage";
import ProfilePage from "./pages/normalPages/ProfilePage";
import SearchPage from "./pages/normalPages/SearchPage";
import AllHotelsPage from "./pages/normalPages/AllHotelsPage";
import AllFlightsPage from "./pages/normalPages/AllFlightsPage";
import FlightDetailPage from "./pages/normalPages/FlightDetailPage";
import AISearchPage from "./pages/normalPages/AISearchPage";
import HistoryPage from "./pages/normalPages/HistoryPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <BaseLayout>
                <HomePage />
              </BaseLayout>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          {/* If user already login, redirect */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login-otp" element={<OTPLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Normal route */}
          <Route path="/help-center" element={<HelpPage />} />
          <Route path="/advertisement" element={<AdvertisementPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route
            path="/search"
            element={
              <MainLayout>
                <SearchPage />
              </MainLayout>
            }
          />
          <Route
            path="/ai-search"
            element={
              <MainLayout>
                <AISearchPage />
              </MainLayout>
            }
          />
          <Route
            path="/hotels"
            element={
              <MainLayout>
                <AllHotelsPage />
              </MainLayout>
            }
          />
          <Route
            path="/hotel/:id"
            element={
              <MainLayout>
                <HotelDetailPage />
              </MainLayout>
            }
          />
          <Route
            path="/flights"
            element={
              <MainLayout>
                <AllFlightsPage />
              </MainLayout>
            }
          />
          <Route
            path="/flight/:id"
            element={
              <MainLayout>
                <FlightDetailPage />
              </MainLayout>
            }
          />

          {/* Protected for logged in user */}
          <Route element={<AuthorizedRoute />}>
            <Route path="/play-game" element={<GamePage />} />
            <Route
              path="/profile"
              element={
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              }
            />
            <Route path="/hotel/booking" element={<HotelBookingPage />} />
            <Route
              path="/cart"
              element={
                <NormalLayout>
                  <CartPage />
                </NormalLayout>
              }
            />
            <Route
              path="/my-order"
              element={
                <NormalLayout>
                  <MyOrderPage />
                </NormalLayout>
              }
            />
            <Route
              path="/history"
              element={
                <NormalLayout>
                  <HistoryPage />
                </NormalLayout>
              }
            />
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
              path="/admin/newsletter"
              element={
                <AdminLayout>
                  <SendNewsPage />
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
              path="/admin/hotels/:id/add-room"
              element={
                <AdminLayout>
                  <AddRoomPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/airlines"
              element={
                <AdminLayout>
                  <AdminFlightPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/airlines/add"
              element={
                <AdminLayout>
                  <AddAirlinePage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/airlines/:id/add-flight"
              element={
                <AdminLayout>
                  <AddFlightPage />
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

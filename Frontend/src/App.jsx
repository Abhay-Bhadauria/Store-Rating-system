import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import PublicRoute from '@routes/PublicRoute';
import ProtectedRoute from '@routes/ProtectedRoute';
import RoleRoute from '@routes/RoleRoute';
import { ROLES } from '@constants';
import LoginPage from '@pages/auth/LoginPage';
import AdminDashboard from '@pages/admin/AdminDashboard';
import AdminUsers from '@pages/admin/AdminUsers';
import AdminStores from '@pages/admin/AdminStores';
import UserDashboard from '@pages/user/UserDashboard';
import OwnerDashboard from '@pages/owner/OwnerDashboard';
import RegisterPage from "@pages/auth/RegisterPage";
import StoreDetailsPage from "@pages/store/StoreDetailsPage";
import MyRatingsPage from "@pages/user/MyRatingsPage";
import StoresPage from "./pages/store/StoresPage";
import AdminUserDetails from "@pages/admin/AdminUserDetails";
import AdminStoreDetails from "@pages/admin/AdminStoreDetails";
import OwnerRaters from "@pages/owner/OwnerRaters";
import ProfilePage from "@pages/user/ProfilePage";
import './App.css';


const NotFoundPage = () => <div>404 - Page Not Found</div>;
const UnauthorizedPage = () => <div>403 - Unauthorized</div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes - All Authenticated Users */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores"
          element={
            <ProtectedRoute>
              <StoresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores/:id"
          element={
            <ProtectedRoute>
              <StoreDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-ratings"
          element={
            <ProtectedRoute>
              <MyRatingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminUsers />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminUserDetails />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminStores />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/stores/:id"
          element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminStoreDetails />
            </RoleRoute>
          }
        />

        {/* Store Owner Routes */}
        <Route
          path="/owner/dashboard"
          element={
            <RoleRoute allowedRoles={[ROLES.STORE_OWNER]}>
              <OwnerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/owner/raters"
          element={
            <RoleRoute allowedRoles={[ROLES.STORE_OWNER]}>
              <OwnerRaters />
            </RoleRoute>
          }
        />

        {/* Error Pages */}
        <Route path="/403" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

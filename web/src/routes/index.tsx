import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage } from "./elements";
import AuthGuard from "../auth/AuthGuard";
import DashboardLayout from "../layouts/dashboard";

const Router = () => {
    const routes = useRoutes([
      { element: <Navigate to='/home' />, index: true },
      {
        path: 'auth',
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ]
      },
      {
        path: 'home',
        element: <AuthGuard><DashboardLayout><Outlet /></DashboardLayout></AuthGuard>,
        children: [
            { element: <HomePage />, index: true },
            { path: 'profile', element: <ProfilePage /> },
        ]
      },
      { path: '*', element: <NotFoundPage /> }
    ]);
  
      return routes;
  }
  
  export default Router
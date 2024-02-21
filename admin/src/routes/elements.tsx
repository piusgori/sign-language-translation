import { Suspense, lazy } from 'react';
import Preloader from '../components/preloader';

const Loadable = (Component: any) => (props: any) => (
    <Suspense fallback={<Preloader />}><Component {...props} /></Suspense>
);
export const NotFoundPage = Loadable(lazy(() => import('../pages/NotFoundPage')));

export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));

export const AdminPage = Loadable(lazy(() => import('../pages/admin/AdminPage')));
export const RequestsPage = Loadable(lazy(() => import('../pages/admin/RequestsPage')));

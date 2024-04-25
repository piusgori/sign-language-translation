import { Navigate, useRoutes } from "react-router-dom";
import { LoginPage, NotFoundPage, RequestsPage, SingleTopicPage, TopicsPage } from "./elements";
import { useAuthContext } from "../auth/auth-context";
import Preloader from "../components/preloader";
import AuthGuard from "../auth/AuthGuard";
import AdminLayout from '../layout/admin';

export default function Router () {

    const { isInitialized } = useAuthContext();

    const routes = useRoutes([
        { element: <Navigate to='/admin' />, index: true },
        {
            path: 'auth',
            children: [
                { path: 'login', element: <LoginPage /> },
            ]
        },
        {
            path: 'admin',
            element: <AuthGuard><AdminLayout /></AuthGuard>,
            children: [
                { element: <Navigate to='/admin/topics' />, index: true },
                { path: 'topics', element: <TopicsPage /> },
                { path: 'topic', element: <SingleTopicPage /> },
                { path: 'requests', element: <RequestsPage /> },
            ]
        },
        { path: '404', element: <NotFoundPage /> },
        { path: '*', element: <Navigate to='/404' /> },
    ]);

    if (!isInitialized) return <Preloader />

    return routes;
}
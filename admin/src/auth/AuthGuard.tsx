import { ReactNode, useState } from 'react'
import { useAuthContext } from './auth-context'
import { Navigate, useLocation } from 'react-router-dom';;
import Preloader from '../components/preloader';
import LoginPage from '../pages/auth/LoginPage';

const AuthGuard = ({ children }: { children: ReactNode }) => {

    const { isAuthenticated, isInitialized, user } = useAuthContext();
    const { pathname } = useLocation();

    const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

    if (!isInitialized) return <Preloader />;

    if (!isAuthenticated) {
        if (pathname !== requestedLocation) setRequestedLocation(pathname);
        return <LoginPage />;
    }

    if (isAuthenticated && !pathname.includes('/verify-email') && user?.verified === false) {
        return <Navigate to='/auth/verify-email' />
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null);
        return <Navigate to={requestedLocation} />
    }
  return <>{children}</>;
}

export default AuthGuard
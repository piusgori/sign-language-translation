import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';
import { PATH_AFTER_AUTH } from '../config';
import { useAuthContext } from './auth-context';
import Preloader from '../components/loading/Preloader';

const GuestGuard = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isInitialized } = useAuthContext();

    if (isAuthenticated) return <Navigate to={PATH_AFTER_AUTH} />;

    if (!isInitialized) return <Preloader />

  return <>{children}</>;
}

export default GuestGuard
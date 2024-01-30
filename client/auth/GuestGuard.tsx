import { ReactNode, useLayoutEffect } from 'react'
import { useAuthContext } from './auth-context'
import { router } from 'expo-router';
import { PATH_AFTER_AUTH } from '../config';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Preloader from '@/components/loading/preloader';

const ComponentNavigator = () => {

    useLayoutEffect(() => {
        router.replace(PATH_AFTER_AUTH as any);
    }, [])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>You are already authetnicated</Text>
        </View>
    )
}

const GuestGuard = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isInitialized } = useAuthContext();

    if (isAuthenticated) return <ComponentNavigator />

    if (!isInitialized) return <Preloader />

  return <>{children}</>;
}

export default GuestGuard
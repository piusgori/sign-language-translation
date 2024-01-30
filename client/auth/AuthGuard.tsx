import { ReactNode, useLayoutEffect, useState } from 'react'
import { useAuthContext } from './auth-context'
import Preloader from '../components/loading/preloader';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const ComponentNavigator = () => {
    useLayoutEffect(() => {
        router.replace('/auth/login' as any)
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>You are not authenticated</Text>
        </View>
    )
}

const AuthGuard = ({ children }: { children: ReactNode }) => {

    const { isAuthenticated, isInitialized } = useAuthContext();

    if (!isInitialized) return <Preloader />;

    if (!isAuthenticated) return <ComponentNavigator />

  return <>{children}</>;
}

export default AuthGuard
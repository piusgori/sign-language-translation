import { View, StyleSheet, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Splash from '@/components/loading/splash';
import { useAuthContext } from '@/auth/auth-context';

const MainPage = () => {

    const { isInitialized, isAuthenticated } = useAuthContext();

    const router = useRouter();

    useEffect(() => {
      if (isAuthenticated) router.replace('/home/')
    }, [isAuthenticated])
  
    if (!isInitialized) {
      return <Splash />;
    }


  return (
    <View style={{ ...styles.container }}>
      <View style={{ flex: 1 }} />
      <Image style={{ height: 200, width: 200 }} alt='Logo' source={require('@/assets/images/logo-trans.png')} />
      <View style={{ flex: 1 }} />
      <View style={styles.bottomContainer}>
        <Button mode='contained' style={{ borderRadius: 4, width: '100%' }} onPress={() => { router.push('/auth/register') }}>Create Account</Button>
        <Text>Or</Text>
        <Button mode='contained-tonal' style={{ borderRadius: 4, width: '100%' }} onPress={() => { router.push('/auth/login') }}>Sign In</Button>
      </View>
    </View>
  )
}

export default MainPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        backgroundColor: '#fff',
    },

    bottomContainer: {
      gap: 14,
      alignItems: 'center',
      width: '100%'
    }
})
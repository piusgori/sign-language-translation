import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import AuthContextProvider from '@/auth/auth-context'
import PaperProvider from '@/utils/theme'
import { KeyboardAvoidingView } from 'react-native'

const MainLayout = () => {

  return (
    <AuthContextProvider>
      <PaperProvider>
        <StatusBar style='dark' />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }} />
            </KeyboardAvoidingView>
        </SafeAreaView>
      </PaperProvider>
    </AuthContextProvider>
  )
}

export default MainLayout;
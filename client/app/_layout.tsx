import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import AuthContextProvider from '@/auth/auth-context'
import PaperProvider from '@/utils/theme'
import { KeyboardAvoidingView } from 'react-native'
import AppContextProvider from '@/services/app-context'

const MainLayout = () => {

  return (
    <AuthContextProvider>
      <AppContextProvider>
        <PaperProvider>
          <StatusBar style='dark' />
            <KeyboardAvoidingView style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }} />
            </KeyboardAvoidingView>
        </PaperProvider>
      </AppContextProvider>
    </AuthContextProvider>
  )
}

export default MainLayout;
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import AuthContextProvider from '@/auth/auth-context'
import PaperProvider from '@/utils/theme'
import { KeyboardAvoidingView } from 'react-native'

const MainLayout = () => {

  return (
    <AuthContextProvider>
      <PaperProvider>
        <StatusBar style='dark' />
          <KeyboardAvoidingView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} />
          </KeyboardAvoidingView>
      </PaperProvider>
    </AuthContextProvider>
  )
}

export default MainLayout;
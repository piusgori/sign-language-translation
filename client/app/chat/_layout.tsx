import React from 'react'
import { Slot, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AuthGuard from '@/auth/AuthGuard'

const ChatLayout = () => {
  return (
    <AuthGuard>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingBottom: 10 }}>
            <Slot />
        </SafeAreaView>
    </AuthGuard>
  )
}

export default ChatLayout
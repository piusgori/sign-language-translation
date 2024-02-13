import React from 'react'
import AuthGuard from '@/auth/AuthGuard'
import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfileLayout = () => {
  return (
    <AuthGuard>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingBottom: 10 }}>
            <Slot />
        </SafeAreaView>
    </AuthGuard>
  )
}

export default ProfileLayout
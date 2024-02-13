import { View } from 'react-native'
import React from 'react'
import GuestGuard from '../../auth/GuestGuard'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'

const AuthLayout = () => {
  return (
    <GuestGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10 }}>
        <View style={{ flex: 1 }}>
            <Slot />
        </View>
      </SafeAreaView>
    </GuestGuard>
  )
}

export default AuthLayout
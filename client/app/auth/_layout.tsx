import { View } from 'react-native'
import React from 'react'
import GuestGuard from '../../auth/GuestGuard'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <GuestGuard>
      <StatusBar style='auto' backgroundColor='white' />
        <View style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
            <Slot />
        </View>
    </GuestGuard>
  )
}

export default AuthLayout
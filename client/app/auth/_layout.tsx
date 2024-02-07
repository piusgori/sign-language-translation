import { View } from 'react-native'
import React from 'react'
import GuestGuard from '../../auth/GuestGuard'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <GuestGuard>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Slot />
      </View>
    </GuestGuard>
  )
}

export default AuthLayout
import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

const MainLayout = () => {

    const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'} />
        <Slot />
    </SafeAreaView>
  )
}

export default MainLayout
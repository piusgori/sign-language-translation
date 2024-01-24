import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import React from 'react'

const MainPage = () => {
    const colorScheme = useColorScheme();

    const bg = colorScheme === 'dark' ? '#000' : '#fff'

  return (
    <View style={{ ...styles.container }}>
      <Text>index</Text>
    </View>
  )
}

export default MainPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
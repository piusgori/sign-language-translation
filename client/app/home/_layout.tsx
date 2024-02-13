import React from 'react'
import AuthGuard from '@/auth/AuthGuard'
import { Tabs, useRouter } from 'expo-router'
import { Avatar } from 'react-native-paper'
import { TouchableOpacity, View } from 'react-native'
import { useAuthContext } from '@/auth/auth-context'
import { PRIMARY_MAIN } from '@/config'
import { Ionicons } from '@expo/vector-icons';

const HomeLayout = () => {
    const { user } = useAuthContext();
    const router = useRouter();

  return (
    <AuthGuard>
        <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 10, backgroundColor: '#fff' }}>
            <Tabs
                screenOptions={{
                    headerStyle: {
                        elevation: 0
                    },
                    headerRight: () => <TouchableOpacity onPress={() => { router.push('/profile/') }}>
                        <Avatar.Image size={40} source={{ uri: user?.photoURL }} />
                    </TouchableOpacity>,
                    tabBarActiveTintColor: PRIMARY_MAIN,
                    headerTitle: '',
                }}
            >
                <Tabs.Screen
                    name='index'
                    options={{
                        tabBarLabel: 'Communications',
                        tabBarIcon: ({ color, focused, size }) => <Ionicons size={size} color={color} name={focused ? 'chatbubble' : 'chatbubble-outline'} />
                    }}
                />
                <Tabs.Screen
                    name='learn'
                    options={{
                        tabBarLabel: 'Learn',
                        tabBarIcon: ({ color, focused, size }) => <Ionicons size={size} color={color} name={focused ? 'book' : 'book-outline'} />
                    }}
                />
            </Tabs>

        </View>
    </AuthGuard>
  )
}

export default HomeLayout
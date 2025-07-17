
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in"/>
        <Stack.Screen name="sign-up"/>
        <StatusBar backgroundColor="#161622" style="light"/>
      </Stack>
    </>
  )
}

export default AuthLayout
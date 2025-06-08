import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import ModuleScreen from '../screens/ModuleScreen'
import LoginScreen from '../screens/LoginScreen'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { View, Text, ActivityIndicator } from 'react-native'

const Stack = createNativeStackNavigator()

export default function StackNavigator() {
  const [session, setSession] = useState(null)
  const [hasAccess, setHasAccess] = useState(null)
  const [loadingAccess, setLoadingAccess] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const checkAccess = async () => {
      if (session?.user?.email) {
        const { data, error } = await supabase
          .from('access_control')
          .select('is_active')
          .eq('email', session.user.email)
          .single()

        if (error || !data) {
          setHasAccess(false)
        } else {
          setHasAccess(data.is_active)
        }

        setLoadingAccess(false)
      }
    }

    if (session) {
      checkAccess()
    }
  }, [session])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : loadingAccess ? (
          <Stack.Screen
            name="Loading"
            component={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 10 }}>Verificando acesso...</Text>
              </View>
            )}
          />
        ) : hasAccess ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: true }} />
            <Stack.Screen name="Module" component={ModuleScreen} options={{ headerShown: true }} />
          </>
        ) : (
          <Stack.Screen
            name="Blocked"
            component={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Acesso Bloqueado</Text>
                <Text style={{ marginTop: 10, textAlign: 'center' }}>
                  Sua conta não está ativa. Verifique sua assinatura no Hotmart ou entre em contato com o suporte.
                </Text>
              </View>
            )}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

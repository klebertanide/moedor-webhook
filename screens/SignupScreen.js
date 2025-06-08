import { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { supabase } from '../lib/supabase'

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      Alert.alert('Erro ao criar conta', error.message)
    } else {
      Alert.alert('Sucesso!', 'Conta criada. Verifique seu e-mail.')
      navigation.replace('Login')
    }
  }

  return (
    <View style={{ padding: 30 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>Criar conta no MOEDOR</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 5 }}
      />
      <Button title="Criar conta" onPress={handleSignup} />
      <View style={{ marginTop: 20 }}>
        <Button title="Voltar ao login" onPress={() => navigation.replace('Login')} />
      </View>
    </View>
  )
}

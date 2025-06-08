import { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'

export default function HomeScreen({ navigation }) {
  const [modules, setModules] = useState([])

  useEffect(() => {
    supabase.from('modules').select('*').then(({ data }) => setModules(data))
  }, [])

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>Catálogo MOEDOR</Text>
      {modules.map(mod => (
        <TouchableOpacity key={mod.id} style={{ marginBottom: 30 }}
          onPress={() => navigation.navigate('Module', { moduleId: mod.id })}>
          <Image source={{ uri: mod.cover_url }} style={{ height: 180, borderRadius: 12, marginBottom: 8 }} />
          <Text style={{ fontSize: 20, fontWeight: '600' }}>{mod.title}</Text>
          <Text style={{ color: '#777' }}>{mod.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}
import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image } from 'react-native'
import { supabase } from '../lib/supabase'

export default function ModuleScreen({ route }) {
  const { moduleId } = route.params
  const [videos, setVideos] = useState([])

  useEffect(() => {
    supabase.from('videos')
      .select('*')
      .eq('module_id', moduleId)
      .order('order')
      .then(({ data }) => setVideos(data))
  }, [])

  return (
    <ScrollView style={{ padding: 20 }}>
      {videos.map(video => (
        <View key={video.id} style={{ marginBottom: 30 }}>
          <Image source={{ uri: video.thumbnail_url }} style={{ height: 180, borderRadius: 10, marginBottom: 8 }} />
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{video.title}</Text>
          <Text style={{ marginBottom: 8, color: '#777' }}>{video.description}</Text>
          <Text style={{ color: 'blue' }}>{video.video_url}</Text>
        </View>
      ))}
    </ScrollView>
  )
}
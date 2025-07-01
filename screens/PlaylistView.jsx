import {
  StyleSheet,

  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';


import {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {fonts} from '../utils/fonts';

import {fetchPlaylist} from '../utils/http';

import {
  verticalScale,
  moderateScale,
  scale,
} from '../utils/fonts/fonts';


import { useRef } from 'react';
import MediaView from '../components/View/View';

export default function PlaylistView({route}) {
  
  const [playlist, setPlaylist] = useState(null);
  
  const [loading, setLoading] = useState(true);


  const id = route.params.id;


  const token = useSelector(state => state.auth.token);



  useEffect(() => {
    const loadTracks = async () => {
      if (token) {
        setLoading(true);
        setPlaylist(null);
        try {
          const data = await fetchPlaylist(id, token);
          console.log('PLAYLIST', data);

          setPlaylist(data);
        } catch (err) {
          console.error('Error fetching album:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadTracks();
  }, [token, id]);

  if (loading|| !playlist) {
    return (
      <LinearGradient
        colors={['#962419', '#661710', '#430E09']}
        style={styles.linearGradient}>
        <SafeAreaView style={styles.emptyState}>
          <ActivityIndicator size="large" color="#1DB954" />
        </SafeAreaView>
      </LinearGradient>
    );
  }
  return (
    <MediaView data={playlist} type={'playlist'} colors={['#C63224', '#641D17', '#271513', '#121212']}/>
   
  );
}
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

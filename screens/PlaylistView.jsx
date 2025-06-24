import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from '@react-native-vector-icons/ant-design';

import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {images} from '../assets/image';
import {fonts} from '../utils/fonts';
import Ionicons from '@react-native-vector-icons/ionicons';
import {FlatList} from 'react-native-gesture-handler';
import Play from '../components/Play';
import {setcurrAlbum, setcurTrack} from '../store/track';
import {setPlaying} from '../store/track';
import {fetchPlaylist, playPlaylist} from '../utils/http';
import TextCmp from '../UI/SpText';
import { useFocusEffect } from '@react-navigation/native';
import {
  verticalScale,
  moderateScale,
  horizontalScale,
} from '../utils/fonts/fonts';


import { useRef } from 'react';
import MediaView from '../components/View/View';

export default function PlaylistView({route}) {
  
  const [playlist, setPlaylist] = useState(null);
  
  const [loading, setLoading] = useState(true);


  const id = route.params.id;
  const scrollY = useRef(new Animated.Value(0)).current;

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
    <MediaView data={playlist} type={'playlist'}/>
   
  );
}
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    marginVertical: verticalScale(50),
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  images: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  albumName: {
    color: 'white',
    fontFamily: fonts.Demi,
    fontSize: 25,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  artistName: {
    color: 'white',
    marginHorizontal: 8,
    marginVertical: 6,
    fontFamily: fonts.Demi,
    fontSize: 14,
  },
  albumdesc: {
    color: 'white',
    flexDirection: 'row',
    marginHorizontal: 8,
    gap: 12,
  },
  descText: {
    color: 'white',
  },
  iconcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: verticalScale(-30),
  },
  albuminfo: {
    flexDirection: 'row',
  },
  something: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: horizontalScale(8),
  },
  trackdesc: {
    flexDirection: 'row',
    marginHorizontal: horizontalScale(12),
    gap: 8,
    alignItems: 'center',
  },
  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  artist: {
    color: '#B3B3B3',
    fontFamily: fonts.regular,
    marginVertical: 4,
  },
  trackname: {
    color: 'white',
    marginHorizontal: 14,
    fontSize: 16,
    fontFamily: fonts.medium,
    marginVertical: 4,
  },
  dicon: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
  card: {
    marginVertical: verticalScale(8),
  },
  artistimage: {
    width: horizontalScale(23),
    height: verticalScale(23),
    borderRadius: moderateScale(12),
  },
  artistdesc: {
    flexDirection: 'row',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

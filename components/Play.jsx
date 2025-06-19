import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect} from 'react';

import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';

import {useState} from 'react';
import {fonts} from '../utils/fonts';
import {useDispatch, useSelector} from 'react-redux';
import {getcurrentTrack} from '../utils/http';
import {setcurrAlbum, setcurTrack, setPlaying} from '../store/track';
import TrackPlayer from 'react-native-track-player';
import {setupPlayer, addTracks} from '../utils/trackPlayer';
import {Event} from 'react-native-track-player';
import {useRef} from 'react';
import TextCmp from '../UI/SpText';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../utils/fonts/fonts';

export default function Play() {
  const [track, setTrack] = useState();
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const id = useSelector(state => state.player.currentTrack);
  const playing = useSelector(state => state.player.isPlaying);
  const token = useSelector(state => state.auth.token);
  const trackList = useSelector(state => state.player.trackList);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  const trackListRef = useRef(trackList);
  trackListRef.current = trackList;

  useEffect(() => {
    const listener = TrackPlayer.addEventListener(
      Event.PlaybackTrackChanged,
      async event => {
        if (event.nextTrack != null) {
          const nextTrack = await TrackPlayer.getTrack(event.nextTrack);
          

          if (nextTrack) {
            dispatch(setcurTrack(nextTrack.id));
          }
        }
      },
    );

    return () => {
      listener.remove();
    };
  }, [trackList]);

  useEffect(() => {
    const loadTracks = async () => {
      if (token && id) {
        try {
          const current = await getcurrentTrack(token, id);
          
          dispatch(setcurrAlbum(current?.album?.id));

          setTrack(current);
        } catch (err) {
          console.error('Error fetching track:', err);
        }
      }
    };
    loadTracks();
  }, [token, id]);

  useEffect(() => {
    async function setup() {
      const isSetup = await setupPlayer();
      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0 && trackList.length > 0) {
        await addTracks(trackList);
      }
      setIsPlayerReady(isSetup);
    }
    setup();
  }, []);

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#bbb" />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.play}>
      <Pressable
        onPress={() => navigation.navigate('Player')}
        style={styles.flexFill}>
        <View style={styles.row}>
          <Image
            style={styles.mImage}
            source={{uri: track?.album?.images?.[0]?.url}}
          />
          <View style={styles.desc}>
            <TextCmp weight="Demi" width={280}>
              {track?.name}
              <TextCmp weight="medium" size={12}>
                {track?.artists?.[0]?.name || 'Unknown Artist'}
              </TextCmp>
            </TextCmp>
            <View style={styles.bluetooth}>
              <Ionicons name="bluetooth" color="#1DB954" size={12} />
              <TextCmp size={10} color="#1DB954">
                BEATSPILL+
              </TextCmp>
            </View>
          </View>
        </View>
      </Pressable>

      <View style={styles.icons}>
        <Ionicons name="bluetooth" color="#1DB954" size={24} />
        <Pressable
          onPress={async () => {
            const queue = await TrackPlayer.getQueue();
            if (queue.length === 0 && trackList.length > 0 && id) {
              const startIndex = trackList.findIndex(track => track.id === id);
              if (startIndex !== -1) {
                await TrackPlayer.reset();
                await addTracks(trackList);
                await TrackPlayer.skip(trackList[startIndex].id);
                await TrackPlayer.play();
                dispatch(setcurTrack(trackList[startIndex].id));
                dispatch(setPlaying(true));
              }
            } else {
              if (playing) {
                await TrackPlayer.pause();
              } else {
                await TrackPlayer.play();
              }
              dispatch(setPlaying(!playing));
            }
          }}>
          <Ionicons name={playing ? 'pause' : 'play'} color="white" size={30} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    gap: 6,
    marginHorizontal: horizontalScale(8),
  },
  bluetooth: {
    flexDirection: 'row',
    gap: 4,
  },

  music: {
    color: 'white',
    fontFamily: fonts.Demi,
    width: horizontalScale(280),
  },

  mImage: {
    marginHorizontal: horizontalScale(8),
    width: horizontalScale(37),
    height: verticalScale(37),
  },

  play: {
    backgroundColor: '#550A1C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: verticalScale(60),
    alignItems: 'center',
    borderRadius: moderateScale(8),
    paddingHorizontal: horizontalScale(8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  flexFill: {
    flex: 1,
  },
});

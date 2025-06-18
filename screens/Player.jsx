import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, {use, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from '@react-native-vector-icons/ant-design';
import {useState} from 'react';
import Slider from '@react-native-community/slider';
import Ionicons from '@react-native-vector-icons/ionicons';
import {fonts} from '../utils/fonts';
import {playPreviewUrl} from '../utils/play';
import {useDispatch, useSelector} from 'react-redux';
import {setPlaying, setcurTrack} from '../store/track';
import {useTrackPlayerEvents, State, Event} from 'react-native-track-player';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
import {setupPlayer} from '../utils/trackPlayer';
import TextCmp from '../UI/SpText';
import {
  verticalScale,
  moderateScale,
  horizontalScale,
} from '../utils/fonts/fonts';
import {fetchLiked, getcurrentTrack, } from '../utils/http';
import {setcurrAlbum} from '../store/track';
export default function Player({navigation}) {
  const [track, setTrack] = useState();

  const id = useSelector(state => state.player.currentTrack);
  const token = useSelector(state => state.auth.token);

  const playing = useSelector(state => state.player.isPlaying);
  const dispatch = useDispatch();

  const [pressed, setPressed] = useState(false);

  const [replay, setReplay] = useState(false);

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [liked,setLiked]=useState(false)

 

  useEffect(() => {
    const loadTracks = async () => {
      if (token && id) {
        try {
          const current = await getcurrentTrack(token, id);
          const like=await fetchLiked(token,id);
         
          
          setLiked(like)

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
      setIsPlayerReady(isSetup);
    }

    setup();
  }, []);
  useTrackPlayerEvents([Event.PlaybackState], event => {
    if (event.state === State.Playing) {
      dispatch(setPlaying(true));
    } else if (event.state === State.Paused || event.state === State.Stopped) {
      dispatch(setPlaying(false));
    }
  });

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#bbb" />
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={['#962419', '#661710', '#430E09']}
      style={styles.linearGradient}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <AntDesign
            name="down"
            size={20}
            color="white"
            style={{marginHorizontal: 8}}
          />
        </Pressable>

        <TextCmp size={16} weight="Demi" width={250} alignment="center">
          {track?.album?.name}
        </TextCmp>
        <AntDesign
          name="ellipsis"
          size={36}
          color="white"
          style={{marginHorizontal: 8}}
        />
      </View>
      <Image
        style={styles.mainImage}
        source={{uri: track?.album?.images?.[0]?.url}}
      />
      <View>
        <TextCmp size={20} weight="Demi" marginT={30}>
          {track?.name}
        </TextCmp>
        <View style={styles.desc}>
          <TextCmp color="#B3B3B3" size={16}>
            {track?.artists?.[0]?.name || 'Unknown Artist'}
          </TextCmp>
          <Pressable
            onPress={() => {
            
             
              setPressed(!pressed);
            }}
            style={({pressed}) => [
              styles.pressable,
              pressed && styles.pressedStyle,
            ]}>
            <Image
              source={
                liked
                  ? require('../assets/Images/Player/like.png')
                  : require('../assets/Images/Player/unlike.png')
              }
              style={styles.heart}
            />
          </Pressable>
        </View>
        <Slider
          style={{marginVertical: 8}}
          minimumValue={0}
          maximumValue={180}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#B3B3B3"
          thumbTintColor="white"
        />
        <View style={styles.duration}>
          <TextCmp color="#b3b3b3">0:00</TextCmp>
          <TextCmp color="#b3b3b3">
            {track?.duration_ms
              ? `${Math.floor(track.duration_ms / 60000)}:${String(
                  Math.floor((track.duration_ms % 60000) / 1000),
                ).padStart(2, '0')}`
              : '0:00'}
          </TextCmp>
        </View>
      </View>
      <View style={styles.playcontainer}>
        <Ionicons name="shuffle" color="white" size={24} />
        <View style={styles.playing}>
          <Ionicons
            name="play-skip-back"
            color="white"
            size={30}
            style={styles.icon}
            onPress={async () => {
              try {
                await TrackPlayer.skipToPrevious();
              } catch (e) {
                console.warn('No previous track', e);
              }
            }}
          />
          <Pressable
            onPress={async () => {
              if (playing) {
                await TrackPlayer.pause();
              } else {
                await playPreviewUrl(
                  'https://p.scdn.co/mp3-preview/e2e03acfd38d7cfa2baa924e0e9c7a80f9b49137?cid=8897482848704f2a8f8d7c79726a70d4',
                  track,
                );
              }
              dispatch(setPlaying(!playing));
            }}>
            <Ionicons
              name={playing ? 'pause-circle' : 'play-circle'}
              color="white"
              size={76}
            />
          </Pressable>

          <Ionicons
            name="play-skip-forward"
            color="white"
            size={30}
            style={styles.icon}
            onPress={async () => {
              try {
                await TrackPlayer.skipToNext();
              } catch (e) {
                console.warn('No next track', e);
              }
            }}
          />
        </View>
        <Pressable
          onPress={() => setReplay(!replay)}
          style={({pressed}) => [
            styles.pressable,
            pressed && styles.pressedStyle,
          ]}>
          <AntDesign
            name="retweet"
            color={replay ? '#1ED760' : 'white'}
            size={24}
          />
        </Pressable>
      </View>

      <View style={styles.bottom}>
        <View style={styles.bluetooth}>
          <Ionicons name="bluetooth" color="#1ED760" />
          <TextCmp color="#1ED760" size={11}>
            BEATSPILL+
          </TextCmp>
        </View>
        <View style={styles.side}>
          <Ionicons
            name="share-outline"
            color="white"
            size={24}
            style={styles.icon}
          />
          <AntDesign
            name="menu-fold"
            color="white"
            size={24}
            style={styles.icon}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    marginVertical: verticalScale(80),
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  desc: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',
  },

  playing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: horizontalScale(10),
  },

  bluetooth: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    flexDirection: 'row',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bluename: {
    color: '#1ED760',
    fontSize: 11,
    fontFamily: fonts.regular,
  },
  mainImage: {
    width: horizontalScale(380),
    height: verticalScale(380),
  },
  duration: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dtext: {
    color: '#B3B3B3',
  },
  heart: {
    width: horizontalScale(30),
    height: verticalScale(60),
  },
});

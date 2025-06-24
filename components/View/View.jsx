import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
  Image,
} from 'react-native';
import React, {useState} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {setcurTrack, setPlaying} from '../../store/track';
import {Animated} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import TrackPlayer from 'react-native-track-player';
import AntDesign from '@react-native-vector-icons/ant-design';
import {images} from '../../assets/image';

import {useTrackPlayerEvents, Event} from 'react-native-track-player';

import {useRef} from 'react';
import Play from '../Play';
import {useEffect} from 'react';
import TextCmp from '../../UI/SpText';
import {useNavigation} from '@react-navigation/native';

import {useFocusEffect} from '@react-navigation/native';
import {playAlbum, playPlaylist} from '../../utils/http';
import LinearGradient from 'react-native-linear-gradient';
import {
  verticalScale,
  moderateScale,
  horizontalScale,
} from '../../utils/fonts/fonts';
const MediaView = ({data, type, artist}) => {
  const [pressed, setPressed] = useState(false);

  const currentAlbumId = useSelector(state => state.player.currentAlbum);
  const currentPlaylistId = useSelector(state => state.player.currentPlaylist);

  const trackid = useSelector(state => state.player.currentTrack);
  console.log('ngfjfjhf', trackid);

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const scrollY = useRef(new Animated.Value(0)).current;

  const token = useSelector(state => state.auth.token);
  const playing = useSelector(state => state.player.isPlaying);
  const navigation = useNavigation();

  const imageScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [236, 70],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [100, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const iconOpacity = scrollY.interpolate({
    inputRange: [250, 300],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const stickyIconTranslateY = scrollY.interpolate({
    inputRange: [250, 300],
    outputRange: [0, 30],
    extrapolate: 'clamp',
  });
  function getYear(date) {
    const newDate = new Date(date);
    return newDate.getFullYear();
  }

  useTrackPlayerEvents(
    [
      Event.PlaybackState,
      Event.PlaybackActiveTrackChanged,
      Event.PlaybackQueueEnded,
    ],
    async event => {
      if (event.type === Event.PlaybackState) {
        if (event.state === State.Playing) {
          dispatch(setPlaying(true));
        } else if (
          event.state === State.Paused ||
          event.state === State.Stopped ||
          event.state === State.Ready
        ) {
          dispatch(setPlaying(false));
        }
      }

      if (
        event.type === Event.PlaybackActiveTrackChanged &&
        event.nextTrack != null
      ) {
        const nextTrack = await TrackPlayer.getTrack(event.nextTrack);
        if (nextTrack) {
          dispatch(setcurTrack(nextTrack.id));
        }
      }

      if (event.type === Event.PlaybackQueueEnded) {
        dispatch(setPlaying(false));
      }
    },
  );
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        scrollY.setValue(0);
      };
    }, []),
  );
  const isCurrentMedia =
    type === 'album'
      ? currentAlbumId === data.id
      : currentPlaylistId === data.id;

  const handlePress = async () => {
    try {
      if (isCurrentMedia) {
        if (playing) {
          await TrackPlayer.pause();
          dispatch(setPlaying(false));
        } else {
          await TrackPlayer.play();
          dispatch(setPlaying(true));
        }
      } else {
        if (type === 'album') {
          await playAlbum(data.id, token, dispatch, trackid, true);
        } else {
          await playPlaylist(data.id, token, dispatch, trackid, true);
        }
      }
    } catch (error) {
      console.error('Error handling media press:', error);
    }
  };

  const renderItem = ({item}) => {
    const isCurrent = item.id === trackid;

    return (
      <Pressable
        onPress={() => {
          (async () => {
            if (type === 'album') {
              await playAlbum(data.id, token, dispatch, item.id, true);
            } else {
              await playPlaylist(data.id, token, dispatch, item.track.id, true);
            }
          })();
        }}>
        <View style={styles.card}>
          <TextCmp
            marginH={14}
            weight="medium"
            marginV={4}
            size={16}
            color={isCurrent ? '#1ED760' : 'white'}>
            {type==='album'
            ?item.name:item.track.name}
          </TextCmp>
          <View style={styles.track}>
            <View style={styles.trackdesc}>
              <Image style={styles.dicon} source={images.download} />
              <TextCmp color="#B3B3B3" marginH={4} style={styles.artist}>
                {type === 'album'
                  ? data?.artists?.[0]?.name
                  : item?.track?.artists?.[0]?.name}
              </TextCmp>
            </View>
            <View>
              <AntDesign
                name="ellipsis"
                size={24}
                color="white"
                style={{marginHorizontal: 8, transform: [{rotate: '90deg'}]}}
              />
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    async function setup() {
      let isSetup = await setupPlayer();

      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await addTracks();
      }

      setIsPlayerReady(isSetup);
    }

    setup();
  }, []);

  return (
    <LinearGradient
      colors={['#C63224', '#641D17', '#271513', '#121212']}
      style={styles.linearGradient}>
      <View style={styles.header}>
        <AntDesign
          name="left"
          size={20}
          color="white"
          style={{marginHorizontal: 24}}
          onPress={() => navigation.goBack()}
        />
        <TextCmp size={18} weight="Demi" opacity={titleOpacity} animated={true}>
          {data?.name}
        </TextCmp>

        <Animated.View
          style={{
            opacity: iconOpacity,
            transform: [{translateY: stickyIconTranslateY}],
            position: 'absolute',
            right: 10,
          }}>
          <Pressable onPress={handlePress}>
            <Ionicons
              name={playing && isCurrentMedia ? 'pause-circle' : 'play-circle'}
              color="#1ED760"
              size={76}
            />
          </Pressable>
        </Animated.View>
      </View>

      <Animated.FlatList
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}
        data={data?.tracks?.items || []}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 300}}
        ListHeaderComponent={
          <>
            <View style={styles.imageContainer}>
              <Animated.View style={{width: imageScale, height: imageScale}}>
                {data?.images && (
                  <Image
                    style={styles.images}
                    source={{uri: data.images[0].url}}
                  />
                )}
              </Animated.View>
            </View>
            {data && (
              <>
                <TextCmp weight="Demi" size={25} marginH={8} marginV={8}>
                  {data.name}
                </TextCmp>
                <View style={styles.something}>
                  <View>
                    <View style={styles.artistdesc}>
                      {type === 'album' ? (
                        <>
                          <Image
                            style={styles.artistimage}
                            source={{uri: artist?.images?.[0]?.url}}
                          />
                          <TextCmp
                            marginH={8}
                            marginV={6}
                            size={14}
                            weight="Demi"
                            style={styles.artistName}>
                            {data?.artists?.[0]?.name}
                          </TextCmp>
                        </>
                      ) : (
                        <TextCmp marginH={8} marginV={6} weight="Demi">
                          {data?.owner?.display_name}
                        </TextCmp>
                      )}
                    </View>

                    <View style={styles.albumdesc}>
                      <TextCmp>{data.type}</TextCmp>
                      {type === 'album' && (
                        <TextCmp>{getYear(data?.release_date)}</TextCmp>
                      )}
                    </View>
                  </View>

                  <Animated.View
                    style={{
                      position: 'absolute',
                      right: 10,
                      zIndex: 10,
                      top: 48,

                      transform: [{translateY: stickyIconTranslateY}],
                    }}>
                    <Pressable onPress={handlePress}>
                      <Ionicons
                        name={
                          playing && isCurrentMedia
                            ? 'pause-circle'
                            : 'play-circle'
                        }
                        color="#1ED760"
                        size={76}
                      />
                    </Pressable>
                  </Animated.View>
                </View>

                <View style={styles.iconcontainer}>
                  <Pressable
                    onPress={() => setPressed(!pressed)}
                    style={({pressed}) => [
                      styles.pressable,
                      pressed && styles.pressedStyle,
                    ]}>
                    <Image
                      source={
                        pressed
                          ? require('../../assets/Images/Player/unlike.png')
                          : require('../../assets/Images/Player/like.png')
                      }
                      style={[styles.icon]}
                    />
                  </Pressable>
                  <Image source={images.download} />
                  <AntDesign
                    name="ellipsis"
                    size={24}
                    color="white"
                    style={{marginHorizontal: 8}}
                  />
                </View>
              </>
            )}
          </>
        }></Animated.FlatList>

      {trackid && (
        <View>
          <Play />
        </View>
      )}
    </LinearGradient>
  );
};

export default MediaView;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    marginVertical: verticalScale(40),
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
  },

  albumdesc: {
    color: 'white',
    flexDirection: 'row',
    marginHorizontal: 8,
    gap: 12,
  },

  iconcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: verticalScale(5),
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
  root: {
    flex: 1,
    backgroundColor: '#111111',
  },
});

import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from '@react-native-vector-icons/ant-design';
import {
  fetchAlbumTrack,
  fetchAlbumView,
  fetchArtist,
  playAlbum,
} from '../utils/http';
import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {images} from '../assets/image';
import {fonts} from '../utils/fonts';
import Ionicons from '@react-native-vector-icons/ionicons';
import {FlatList} from 'react-native-gesture-handler';
import Play from '../components/Play';
import {setcurTrack, setPlaying} from '../store/track';

import TrackPlayer from 'react-native-track-player';
import {addTracks} from '../utils/trackPlayer';
import {useTrackPlayerEvents, Event} from 'react-native-track-player';
import TextCmp from '../UI/SpText';
import {
  verticalScale,
  horizontalScale,
  moderateScale,
} from '../utils/fonts/fonts';

export default function AlbumView({navigation, route}) {
  const [album, setAlbum] = useState(null);
  const [pressed, setPressed] = useState(false);

  const [track, setTrack] = useState(null);
  const [artist, setArtist] = useState(null);
  const dispatch = useDispatch();
  const id = route.params.id;
  const token = useSelector(state => state.auth.token);
  const playing = useSelector(state => state.player.isPlaying);
  const trackid = useSelector(state => state.player.currentTrack);
  const currentAlbumId = useSelector(state => state.player.currentAlbum);
  const [loading, setLoading] = useState(true);

  function getYear(date) {
    const newDate = new Date(date);
    return newDate.getFullYear();
  }
  useTrackPlayerEvents(
    [Event.PlaybackState, Event.PlaybackActiveTrackChanged],
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
      useTrackPlayerEvents([Event.PlaybackQueueEnded], event => {
        if (!event.track || event.position > 0) {
          dispatch(setPlaying(false));
        }
      });

      if (
        event.type === Event.PlaybackActiveTrackChanged &&
        event.nextTrack != null
      ) {
        const nextTrack = await TrackPlayer.getTrack(event.nextTrack);
        if (nextTrack) {
          dispatch(setcurTrack(nextTrack.id));
        }
      }
    },
  );

  const renderItem = ({item}) =>{
    const isCurrent = item.id === trackid;

   return(
    <Pressable
      onPress={() => {
        (async () => {
          await playAlbum(album.id, token, dispatch,item.id, true);

        })();
      }}>
      <View style={styles.card}>
        <TextCmp
          marginH={14}
          weight="medium"
          marginV={4}
          size={16}
          color={isCurrent ? '#1ED760' : 'white'}>
          {item.name}
        </TextCmp>
        <View style={styles.track}>
          <View style={styles.trackdesc}>
            <Image style={styles.dicon} source={images.download} />
            <TextCmp color="#B3B3B3" marginH={4} style={styles.artist}>
              {album?.artists[0]?.name}
            </TextCmp>
          </View>
          <View>
            <AntDesign
              name="ellipsis"
              size={24}
              color="white"
              style={{marginHorizontal: 8}}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
  const [isPlayerReady, setIsPlayerReady] = useState(false);

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
  useEffect(() => {
    const loadTracks = async () => {
      if (token && id) {
        setLoading(true);
        setAlbum(null);
        setTrack(null);
        setArtist(null);

        try {
          const data = await fetchAlbumView(id, token);
          const trackdata = await fetchAlbumTrack(id, token);
          const artistId = data.artists[0].id;
          const artistdata = await fetchArtist(artistId, token);

          setAlbum(data);
          setTrack(trackdata.items);
          setArtist(artistdata);
        } catch (err) {
          console.error('Error fetching album:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTracks();
  }, [token, id]);

  if (loading) {
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
    <LinearGradient
      colors={['#962419', '#661710', '#430E09']}
      style={styles.linearGradient}>
      <View style={styles.header}>
        <AntDesign
          name="left"
          size={20}
          color="white"
          style={{marginHorizontal: 24}}
          onPress={() => navigation.goBack()}
        />
      </View>

      <View style={{flex: 1}}>
       

      

        <FlatList
          data={track}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View style={styles.imageContainer}>
          {album?.images && (
            <Image style={styles.images} source={{uri: album.images[0].url}} />
          )}
        </View>
          {album && (
          <>
            <TextCmp weight="Demi" size={25} marginH={8} marginV={8}>
              {album.name}
            </TextCmp>
            <View style={styles.something}>
              <View>
                <View style={styles.artistdesc}>
                  <Image
                    style={styles.artistimage}
                    source={{uri: artist.images[0].url}}
                  />

                  <TextCmp
                    marginH={8}
                    marginV={6}
                    size={14}
                    weight="Demi"
                    style={styles.artistName}>
                    {album.artists[0].name}
                  </TextCmp>
                </View>
                <View style={styles.albumdesc}>
                  <TextCmp>{album.type}</TextCmp>
                  <TextCmp>{getYear(album.release_date)}</TextCmp>
                </View>
              </View>

              <Pressable
                onPress={async () => {
                  try {
                    if (currentAlbumId === album.id) {
                      if (playing) {
                        await TrackPlayer.pause();
                        dispatch(setPlaying(false));
                      } else {
                        await TrackPlayer.play();
                        dispatch(setPlaying(true));
                      }
                    } else {
                      await playAlbum(album.id, token, dispatch, trackid, true);
                    }
                  } catch (error) {
                    console.error('Error handling album press:', error);
                  }
                }}>
                <Ionicons
                  name={
                    playing && currentAlbumId === album.id
                      ? 'pause-circle'
                      : 'play-circle'
                  }
                  color="#1ED760"
                  size={76}
                />
              </Pressable>
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
                      ? require('../assets/Images/Player/unlike.png')
                      : require('../assets/Images/Player/like.png')
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
          }
        />
      </View>
      <View>{trackid && <Play />}</View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    marginVertical: verticalScale(50),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  images: {
    width: horizontalScale(234),
    height: verticalScale(236),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
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
  root: {
    flex: 1,
    backgroundColor: '#111111',
  },
});

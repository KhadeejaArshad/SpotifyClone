import {StyleSheet, Text, View, FlatList, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSavedSongs, playLiked} from '../utils/http';
import TextCmp from '../UI/SpText';
import {images} from '../assets/image';
import AntDesign from '@react-native-vector-icons/ant-design';
import {
  moderateScale,
  horizontalScale,
  verticalScale,
} from '../utils/fonts/fonts';
import LinearGradient from 'react-native-linear-gradient';
import Play from '../components/Play';

import Ionicons from '@react-native-vector-icons/ionicons';
import {setcurTrack, setPlaying} from '../store/track';

import TrackPlayer from 'react-native-track-player';
import {useTrackPlayerEvents, Event} from 'react-native-track-player';

export default function LikedItems({navigation,route}) {
  const token = useSelector(state => state.auth.token);
  const trackid = useSelector(state => state.player.currentTrack);

  const [pressed, setPressed] = useState(false);
  const playing = useSelector(state => state.player.isPlaying);
  const source = useSelector(state => state.player.source);
  const dispatch = useDispatch();
 

  const song=route.params.song

  useTrackPlayerEvents(
    [Event.PlaybackState, Event.PlaybackTrackChanged],
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
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack != null
      ) {
        const nextTrack = await TrackPlayer.getTrack(event.nextTrack);
        if (nextTrack) {
          dispatch(setcurTrack(nextTrack.id));
        }
      }
    },
  );
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



  const renderItem = ({item}) => {
     const isCurrent = item.id === trackid;
    return (
       <Pressable
             onPress={() => {
               (async () => {
                 await playLiked(token, dispatch,item.id,true);
               })();
             }}>
        <View style={styles.card}>
          <Image
            source={{uri: item.album.images[0].url}}
            style={styles.images}
          />

          <View style={{flex: 1, marginHorizontal: 8}}>
            <TextCmp
              marginH={14}
              weight="medium"
              marginV={4}
              size={16}
              color={isCurrent ? '#1ED760' : 'white'}>
              {item.name}
            </TextCmp>
            <View style={styles.trackdesc}>
              <Image style={styles.dicon} source={images.download} />
              <TextCmp color="white" marginH={4} style={styles.artist}>
                {item?.artists[0]?.name}
              </TextCmp>
            </View>
          </View>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <AntDesign
              name="ellipsis"
              size={24}
              color="white"
              style={{marginHorizontal: 8}}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={['#353150', '#4d519b', '#4f6368']}
      style={styles.linearGradient}>
      <View style={styles.header}>
        <AntDesign
          name="left"
          size={20}
          color="white"
          style={{marginHorizontal: 24}}
          onPress={() => navigation.navigate('Library')}
        />
      </View>

      <View style={{flex: 1}}>
        <View style={styles.imageContainer}>
          <Image style={styles.mainimage} source={images.liked} />
        </View>

        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 8,
              marginBottom: -20,
            }}>
            <TextCmp weight="Demi" size={25} marginH={8} marginV={8}>
              LikedSongs
            </TextCmp>
            <Pressable
              onPress={async () => {
                try {
                  if (source === 'liked') {
                    if (playing) {
                      await TrackPlayer.pause();
                      dispatch(setPlaying(false));
                    } else {
                      await TrackPlayer.play();
                      dispatch(setPlaying(true));
                    }
                  } else {
                    await playLiked(token, dispatch, true);
                  }
                } catch (error) {
                  console.error('Error handling album press:', error);
                }
              }}>
              <Ionicons
                name={
                  playing && source === 'liked' ? 'pause-circle' : 'play-circle'
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
                    ? require('../assets/Images/Player/like.png')
                    : require('../assets/Images/Player/unlike.png')
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

        <FlatList
          data={song}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View>{trackid && <Play />}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // container:{
  //    backgroundColor: '#111111',
  //     flex:1,

  // },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
    width: '100%',
    // justifyContent: 'space-between',
  },
  trackdesc: {
    flexDirection: 'row',
    marginHorizontal: horizontalScale(12),
    gap: 8,
  },
  track: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  images: {
    width: horizontalScale(60),
    height: verticalScale(60),
    borderRadius: moderateScale(4),
    marginRight: horizontalScale(12),
  },
  desccard: {
    flex: 1,
  },
  dicon: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
  trackdesc: {
    flexDirection: 'row',
    marginHorizontal: horizontalScale(12),
    gap: 8,
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    marginVertical: verticalScale(50),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },

  iconcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: verticalScale(-5),
  },
  mainimage: {
    width: horizontalScale(234),
    height: verticalScale(236),
  },
});

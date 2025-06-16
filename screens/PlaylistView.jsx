import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
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
import {setcurTrack} from '../store/track';
import {setPlaying} from '../store/track';
import {fetchPlaylist} from '../utils/http';
import TextCmp from '../UI/SpText';
import { verticalScale,moderateScale,horizontalScale } from '../utils/fonts/fonts';
export default function PlaylistView({route,navigation}) {

  const [pressed, setPressed] = useState(false);
  const [playlist, setPlaylist] = useState(null);


  const dispatch = useDispatch();
  const id = route.params.id;
  const token = useSelector(state => state.auth.token);
  const playing = useSelector(state => state.player.isPlaying);


  const renderItem = ({item}) => {
    const track = item.track;

    if (!track) return null; 

    return (
      <Pressable onPress={() => dispatch(setcurTrack(track.id))}>
        <View style={styles.card}>
          <TextCmp marginH={14} size={16} weight='medium' marginV={4}  >{track.name}</TextCmp>

          <View style={styles.track}>
            <View style={styles.trackdesc}>
              <Image style={styles.dicon} source={images.download} />
              <TextCmp marginV={4} color='#b3B3B3'>{track.artists[0]?.name}</TextCmp>
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
  };

  useEffect(() => {
    const loadTracks = async () => {
      if (token) {
        try {
          const data = await fetchPlaylist(id, token);

          console.log(data);
          setPlaylist(data);
        } catch (err) {
          console.error('Error fetching album:', err);
        }
      }
    };
    loadTracks();
  }, [token, id]);

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
        <View style={styles.imageContainer}>
          {playlist?.images && (
            <Image
              style={styles.images}
              source={{uri: playlist.images[0].url}}
            />
          )}
        </View>

        {playlist && (
          <>
            <TextCmp weight='Demi' size={25} marginH={8} marginV={8}>{playlist.name}</TextCmp>
            <View style={styles.something}>
              <View>
                <View style={styles.artistdesc}>
                
                  <TextCmp marginH={8} marginV={6} weight='Demi'>
                    {playlist.owner.display_name}
                  </TextCmp>
                </View>
                <View style={styles.albumdesc}>
                  <TextCmp>{playlist.type}</TextCmp>
                 
                </View>
              </View>

              <Pressable
                onPress={() => {
                  dispatch(setPlaying(!playing));
                }}>
                <Ionicons
                  name={playing ? 'pause-circle' : 'play-circle'}
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
        )}

        <FlatList
          data={playlist?.tracks?.items || []}
          renderItem={renderItem}
          keyExtractor={item => item.track?.id}
        />
      </View>

      <Play />
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
});

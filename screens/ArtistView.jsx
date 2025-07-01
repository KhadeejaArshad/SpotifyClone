import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from '@react-native-vector-icons/ant-design';

import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {images} from '../assets/image';
import {fonts} from '../utils/fonts';

import Play from '../components/Play';
import {useRef} from 'react';
import {Animated} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {fetchArtist, fetchArtistTrack, fetchPlaylist} from '../utils/http';
import TextCmp from '../UI/SpText';
import {
  verticalScale,
  scale,
  moderateScale,
} from '../utils/fonts/fonts';
export default function ArtistView({route, navigation}) {
  const [pressed, setPressed] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const id = route.params.id;
  const token = useSelector(state => state.auth.token);

  const trackid = useSelector(state => state.player.currentTrack);
  const scrollY = useRef(new Animated.Value(0)).current;

  const imageScale = scrollY.interpolate({
    inputRange: [verticalScale(0), verticalScale(100)],
    outputRange: [verticalScale(236), verticalScale(70)],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [verticalScale(100), verticalScale(200)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        scrollY.setValue(0);
      };
    }, []),
  );

  const formatNumber = num => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderItem = ({item}) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('AlbumView', {id: item.id})}>
        <View style={styles.card}>
          {item?.images?.[0]?.url && (
            <Image
              style={styles.albumImage}
              source={{uri: item?.images[0]?.url}}
            />
          )}

          <View style={styles.desccard}>
            <TextCmp
              marginH={14}
              size={16}
              weight="medium"
              marginV={4}
              width={300}>
              {item.name}
            </TextCmp>

            <View style={styles.track}>
              <View style={styles.trackdesc}>
                <TextCmp color="#B3B3B3" marginV={4}>
                  {item.artists[0]?.name}
                </TextCmp>
                <TextCmp color="#B3B3B3" marginV={4}>
                  • {item.release_date?.split('-')[0]}
                </TextCmp>
              </View>
            </View>
          </View>

          <AntDesign name="ellipsis" size={moderateScale(24)} color="white" />
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    const loadTracks = async () => {
      if (token) {
        setLoading(true);
        setAlbums(null);
        setPlaylist(null);

        try {
          const data = await fetchArtist(id, token);
          const tracks = await fetchArtistTrack(id, token);

          setAlbums(tracks);

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
          size={moderateScale(20)}
          color="white"
          style={{marginHorizontal: scale(24)}}
          onPress={() => navigation.goBack()}
        />
         <TextCmp size={18} weight="Demi" opacity={titleOpacity} animated={true}>
          {playlist?.name}
        </TextCmp>
      </View>

      <View style={{flex: 1}}>
        <Animated.FlatList
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}
          scrollEventThrottle={16}
          data={albums?.items || []}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <>
              <View style={styles.imageContainer}>
                <Animated.View
                  style={
                 
                    {width: imageScale, height: imageScale}
                  }>
                  {playlist?.images && (
                    <Image
                      style={styles.images}
                      source={{uri: playlist.images[0].url}}
                    />
                  )}
                </Animated.View>
              </View>
              {playlist && (
                <>
                  <TextCmp weight="Demi" size={25} marginH={8} marginV={8}>
                    {playlist.name}
                  </TextCmp>
                  <View style={styles.something}>
                    <View>
                      <View style={styles.artistdesc}></View>
                      <View style={styles.albumdesc}>
                        <TextCmp
                          weight="medium"
                          marginH={6}
                          marginV={4}
                          size={16}>
                          {playlist.type}
                        </TextCmp>
                      </View>
                      <TextCmp
                        weight="medium"
                        marginH={6}
                        marginV={4}
                        size={16}>
                        Followers:{formatNumber(playlist.followers.total)}
                      </TextCmp>
                    </View>
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
                        style={styles.icon}
                      />
                    </Pressable>
                    <Image source={images.download}  style={styles.dicon}/>
                    <AntDesign
                      name="ellipsis"
                      size={moderateScale(24)}
                      color="white"
                      style={{marginHorizontal: scale(8)}}
                    />
                  </View>
                </>
              )}
            </>
          }
        />
      </View>

      {trackid && <Play />}
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

  albumdesc: {
    color: 'white',
    flexDirection: 'row',
    marginHorizontal: scale(8),
    gap: scale(12),
  },

  iconcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    marginTop: verticalScale(-5),
  },
  albuminfo: {
    flexDirection: 'row',
  },
  something: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(8),
  },
  trackdesc: {
    flexDirection: 'row',
    marginHorizontal: scale(12),
    gap: scale(8),
    alignItems: 'center',
  },

  artist: {
    color: '#B3B3B3',
    fontFamily: fonts.regular,
    marginVertical: verticalScale(4),
  },

  dicon: {
    width: scale(16),
    height: scale(16),
   
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
    width: '100%',
    justifyContent: 'space-between',
  },
  artistimage: {
    width: scale(23),
    height: scale(23),
    borderRadius: scale(12),
  },
  artistdesc: {
    flexDirection: 'row',
  },
  albumImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: moderateScale(4),
    marginRight: scale(12),
  },
  desccard: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon:{
    width:scale(50),
    height:scale(50)
  }

});

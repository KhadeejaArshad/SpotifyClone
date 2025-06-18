import {StyleSheet, Text, View, FlatList, Image, Pressable,ActivityIndicator} from 'react-native';
import {musicData} from '../data/musicdata';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../utils/fonts';
import {fetchRecentlyPlayed, fetchRecentlyPlayedArtists} from '../utils/http';
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TextCmp from '../UI/SpText';
import {setRecentsLoading} from '../store/appSlice';
import { verticalScale,horizontalScale,moderateScale } from '../utils/fonts/fonts';

export default function Recents({data}) {
  const navigation = useNavigation();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state.auth.token);
  const dispatch=useDispatch();

  // useEffect(() => {
  //   const loadTracks = async () => {
  //     // setLoading(true);
  //     try {
  //       if (token) {
  //         const data = await fetchRecentlyPlayedArtists(token);
  //         setTracks(data);
  //       }
  //     } catch (err) {
  //       console.error('Error fetching recents:', err);
  //     } finally {
  //       // setLoading(false);
  //       dispatch(setLoading({ key: 'recents', value: true }));
  //     }
  //   };
  //   loadTracks();
  // }, [token]);

  const renderItem = ({ item, index }) => (
    <Pressable onPress={() => navigation.navigate('ArtistView', { id: item.id })}>
      <View
        style={[
          styles.item,
          {
            marginLeft: index === 0 ? 16 : 0,
            marginRight: index === tracks.length - 1 ? 16 : 12,
          },
        ]}
      >
        <Image style={styles.image} source={item.image} />
        <TextCmp weight="Demi" marginV={4} alignment="center">
          {item.name}
        </TextCmp>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      {/* {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      ) : ( */}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      {/* )} */}
    </View>
  );
}


const styles = StyleSheet.create({
  screen: {
    marginVertical: verticalScale(8),
  },

  image: {
    width: horizontalScale(105),
    height: verticalScale(105),
    borderRadius:moderateScale(52.5)
  },
});

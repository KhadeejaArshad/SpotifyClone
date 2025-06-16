import {StyleSheet, Text, View, FlatList, Image, Pressable,ActivityIndicator} from 'react-native';
import React, { useState } from 'react';
import {EditorData} from '../data/Editordata';
import { fonts } from '../utils/fonts';
import { fetchTrack } from '../utils/http';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { verticalScale,horizontalScale } from '../utils/fonts/fonts';

import TextCmp from '../UI/SpText';
import { setcurrAlbum, setcurTrack } from '../store/track';

export default function Editors() {
  const dispatch = useDispatch();
  const [song, setSong] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        setLoading(true); 
        if (token) {
          const data = await fetchTrack(token);
          console.log("Editors:",data)
          
          setSong(data);
        }
      } catch (err) {
        console.error('Error fetching editor picks:', err);
      } finally {
        setLoading(false); 
      }
    };

    loadTracks();
  }, [token]);

  const renderItem = ({ item, index }) => (
    <Pressable
      onPress={()=>{dispatch(setcurTrack(item.id))
        
      }}
      style={[
        styles.item,
        {
          marginLeft: index === 0 ? 12 : 0,
          marginRight: index === song.length - 1 ? 12 : 12,
        },
      ]}
    >
      <Image style={styles.image} source={{ uri: item.image }} />
      <View style={styles.desc}>
        <TextCmp size={12} marginV={8}>{item.name}</TextCmp>
        <TextCmp size={12}>{item.artist}</TextCmp>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <TextCmp size={22} weight='Demi' marginV={8} marginH={10}>Editor's picks</TextCmp>
      <FlatList
        data={song}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: horizontalScale(4)}} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main:{
    marginTop:0

  },
  text: {
    color: 'white',
    fontSize: 12,
    fontFamily:fonts.regular,
    marginVertical: verticalScale(8),
  },
  artistname:{
    color: 'white',
    fontSize: 12,
    fontFamily:fonts.regular,
  

  },
  item: {
    width:horizontalScale(150),
    marginVertical:0
  },
 
  mainEText: {
    color: 'white',
    fontSize: 22,
    fontFamily:fonts.Demi,
    marginVertical: verticalScale(8),
    marginHorizontal: horizontalScale(10),
  },
  image:{
    width:horizontalScale(150),
    height:verticalScale(150)
  },

});

import {StyleSheet, Text, View, FlatList, Image, Pressable,ActivityIndicator} from 'react-native';
import React from 'react';

import {images} from '../assets/image';

import {useState} from 'react';
import {useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';
import TextCmp from '../UI/SpText';

import { verticalScale,horizontalScale } from '../utils/fonts/fonts';



export default function Wrap({data}) {
  const navigation = useNavigation();
  const [album, setAlbum] = useState([]);
 
  const token = useSelector(state => state.auth.token);



  const renderItem = ({ item, index }) => (
    <Pressable
      onPress={() => navigation.navigate('AlbumView', { id: item.id })}
      style={[
        styles.item,
        {
          marginLeft: index === 0 ? 12 : 0,
          marginRight: index === album.length - 1 ? 8 : 12,
        },
      ]}
    >
      <Image style={styles.image} source={item?.image} />
      <TextCmp weight="Demi" marginT={8} width={150}>
        {item.title}
      </TextCmp>
    </Pressable>
  );

  return (
    <>
      <View style={styles.wrapcontainer}>
        <Image style={styles.wImage} source={images.wrap1} />
        <View>
          <TextCmp size={12} marginV={3}>#SPOTIFYWRAPPED</TextCmp>
          <TextCmp size={22} weight="bold" marginH={4} marginV={6}>
            Your 2021 in review
          </TextCmp>
        </View>
      </View>

      <View style={styles.screen}>
      
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
      
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'row',
    gap: 14,
  },
  wrapcontainer: {
    flexDirection: 'row',
    marginHorizontal: horizontalScale(8),
 
    marginVertical: verticalScale(20),
   
  },
  wImage: {
    marginHorizontal: horizontalScale(4),
  },
 
  image: {
    width: horizontalScale(154),
    height: verticalScale(154),
  },
  item:{
    
     height:200,
     
  }
});

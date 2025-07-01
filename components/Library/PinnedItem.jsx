import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AntDesign from '@react-native-vector-icons/ant-design';

import TextCmp from '../../UI/SpText';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

export default function PinnedItem({data,image,text,subtext}) {
  const navigation=useNavigation();
  return (
    <Pressable style={styles.main} onPress={()=>{navigation.navigate('LikedSongs',{
      song:data
    })}}>
      <Image source={image} style={styles.img}/>

      <View style={styles.text}>
        <TextCmp weight='bold' marginH={12}>{text}</TextCmp>

        <View style={styles.desc}>
          <AntDesign name="pushpin" color="#1ED760" size={moderateScale(15)} />
          <TextCmp weight='medium' marginH={4} color='#B3B3B3'>{subtext}</TextCmp>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems:'center',
    marginHorizontal:scale(8),
    marginVertical:verticalScale(8)
    
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
  },

  icon: {
    marginHorizontal: scale(-45),
    marginVertical: verticalScale(24),
  },
  desc: {
    flexDirection: 'row',
    alignItems:'center',
    marginVertical:verticalScale(4),
    marginHorizontal:scale(6)
  },
  img:{
    width:scale(65),
    height:scale(65)
  }
  
  
});

import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AntDesign from '@react-native-vector-icons/ant-design';

import TextCmp from '../../UI/SpText';
import { verticalScale,moderateScale,horizontalScale } from '../../utils/fonts/fonts';
import { useNavigation } from '@react-navigation/native';

export default function PinnedItem({image,text,subtext}) {
  const navigation=useNavigation();
  return (
    <Pressable style={styles.main} onPress={()=>{navigation.navigate('LikedSongs')}}>
      <Image source={image} />

      <View style={styles.text}>
        <TextCmp weight='bold' marginH={12}>{text}</TextCmp>

        <View style={styles.desc}>
          <AntDesign name="pushpin" color="#1ED760" />
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
    marginHorizontal:horizontalScale(8),
    marginVertical:verticalScale(8)
    
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
  },

  icon: {
    marginHorizontal: horizontalScale(-45),
    marginVertical: verticalScale(24),
  },
  desc: {
    flexDirection: 'row',
    alignItems:'center',
    marginVertical:verticalScale(4),
    marginHorizontal:horizontalScale(6)
  },
  
  
});

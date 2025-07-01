import { StyleSheet, Text, View,Image,Pressable } from 'react-native'
import React from 'react'
import { fonts } from '../../utils/fonts'
import TextCmp from '../../UI/SpText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default function LoginButoon({text,image}) {
  return (
     <Pressable>
            <View style={styles.google}>
              <Image style={styles.icon} source={image}/>
              <TextCmp weight='bold'>{text}</TextCmp>
            </View>
          </Pressable>
  )
}

const styles = StyleSheet.create({
     google: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', 
      borderColor: '#7F7F7F',
      borderWidth: moderateScale(1),
      borderRadius: moderateScale(24),
      paddingVertical: verticalScale(14),
    
      marginVertical: verticalScale(10),
      marginHorizontal: scale(20),
      position: 'relative', 
    },
    icon: {
      position: 'absolute',
      left: verticalScale(26),
      width:scale(22),
      height:scale(22)
    },
})
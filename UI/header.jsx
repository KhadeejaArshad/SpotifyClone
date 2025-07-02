import { Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import AntDesign from '@react-native-vector-icons/ant-design';
import Ionicons from '@react-native-vector-icons/ionicons';


import { useDispatch } from 'react-redux';
import { logout } from '../store/authenticate';
import { setcurTrack } from '../store/track';
import { moderateScale } from 'react-native-size-matters';



export default function HeaderIcons({ tintColor }) {
  const dispatch = useDispatch();


  const handleLogout =() => {
    dispatch(logout());
    
    dispatch(setcurTrack(null))
  };

  return (
    <View style={styles.container}>
      <AntDesign name='bell' color={tintColor} size={moderateScale(18)} />
      <Ionicons name='reload' color={tintColor} size={moderateScale(18)} />
      <AntDesign name='setting' color={tintColor} size={moderateScale(18)} />
      <Pressable onPress={handleLogout}>
        <AntDesign name='logout' color={tintColor} size={moderateScale(18)} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        gap:12,
        marginRight: 16,

    }

})
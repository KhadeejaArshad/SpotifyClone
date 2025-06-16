import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {images} from '../assets/image';
import {fonts} from '../utils/fonts';
import LoginButoon from '../components/Login/LoginButoon';
import { useDispatch } from 'react-redux';
import { loginToSpotify } from '../utils/auth/auth';
import { isAuthenticate, setExpireTime, setRefreshToken, setUserId } from '../store/authenticate';
import { ScrollView } from 'react-native-gesture-handler';
import TextCmp from '../UI/SpText';
import { verticalScale,horizontalScale,moderateScale } from '../utils/fonts/fonts';



export default function Login() {
    const dispatch = useDispatch();

  const handleSpotifyLogin = async () => {
    try {
      const res = await loginToSpotify();       
      dispatch(isAuthenticate(res.accessToken));
      dispatch(setRefreshToken(res.refreshToken)) 
      dispatch(setExpireTime(res.accessTokenExpirationDate))
       
    } catch (err) {
      console.warn('Spotify login failed', err);
    }
  };

  return (
    <ScrollView style={styles.root}>
      <Image source={images.login} />
    <View style={styles.textcontainer}>
        <TextCmp weight='bold' size={28} marginV={4}>Millions of Songs.</TextCmp>
      <TextCmp  weight='bold' size={28} marginV={4}>Free on Spotify.</TextCmp>
    </View>
      <Pressable onPress={handleSpotifyLogin}>
        <View style={styles.buttonOuterContainer}>
          <TextCmp color='black' alignment='center' weight='Demi' size={16} >Sign Up for free</TextCmp>
        </View>
      </Pressable>
      <LoginButoon image={images.google} text={'Continue with Google'}/>
      <LoginButoon image={images.facebook} text={'Continue with Facebook'}/>
      <LoginButoon image={images.apple} text={'Continue with Apple'}/>
     
      <Pressable onPress={handleSpotifyLogin}>
        <TextCmp alignment='center' size={20} weight='Demi' marginV={10}>Log in</TextCmp>
      </Pressable>
        

     
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111111',
  },
  buttonOuterContainer: {
    backgroundColor: '#1ED760',
    
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(24),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    marginHorizontal:horizontalScale(16),
    marginVertical:horizontalScale(10),
   
    alignItems: 'center',
    justifyContent: 'center',
  },


  textcontainer:{
  justifyContent: 'center',
  alignItems: 'center', 

 
  },


});

import { StyleSheet, Text, View, FlatList,Image,Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedSongs} from '../utils/http';
import TextCmp from '../UI/SpText';
import { images } from '../assets/image';
import AntDesign from '@react-native-vector-icons/ant-design';
import { moderateScale,horizontalScale,verticalScale } from '../utils/fonts/fonts';
import LinearGradient from 'react-native-linear-gradient';
import Play from '../components/Play';
import { setcurTrack } from '../store/track';


export default function LikedItems({navigation}) {
  const token = useSelector(state => state.auth.token);
  const trackid=useSelector(state=>state.player.currentTrack);
  const dispatch=useDispatch();
  const [song,setSongs]=useState([]);
  const likesVersion = useSelector(state => state.player.likesVersion);
   useEffect(() => {
     const loadTracks = async () => {
       if (token) {
         try {
           const songs=await fetchSavedSongs(token)
           
            const extractedTracks = songs.items.map(item => item.track);
           
            
           setSongs(extractedTracks)
           
 
        
         } catch (err) {
           console.error('Error fetching album:', err);
         }
       }
     };
     loadTracks();
   }, [token,likesVersion]);

const renderItem = ({ item }) =>{
  return (
  <Pressable onPress={()=>dispatch(setcurTrack(item.id))}>
    <View style={styles.card}>
    <Image source={{ uri: item.album.images[0].url }} style={styles.images} />

    <View style={{ flex: 1, marginHorizontal: 8 }}>
      <TextCmp weight="medium" marginV={4} size={16}>
        {item.name}
      </TextCmp>
      <View style={styles.trackdesc}>
        <Image style={styles.dicon} source={images.download} />
        <TextCmp color="white" marginH={4} style={styles.artist}>
          {item?.artists[0]?.name}
        </TextCmp>
      </View>
    </View>

    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <AntDesign
        name="ellipsis"
        size={24}
        color="white"
        style={{ marginHorizontal: 8 }}
      />
    </View>
  </View>
  </Pressable>
);
}

 

  
  return (
    <LinearGradient
      colors={['#353150', '#4d519b', '#4f6368']}
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
        
            <Image style={styles.mainimage} source={images.liked} />
        
        </View>

        
          <>
            <TextCmp weight="Demi" size={25} marginH={8} marginV={8}>
              LikedSongs
            </TextCmp>
            {/* <View style={styles.something}>
              <View>
                <View style={styles.artistdesc}>
                  <Image
                    style={styles.artistimage}
                    source={{uri: artist.images[0].url}}
                  />

                  <TextCmp
                    marginH={8}
                    marginV={6}
                    size={14}
                    weight="Demi"
                    style={styles.artistName}>
                    {album.artists[0].name}
                  </TextCmp>
                </View>
                <View style={styles.albumdesc}>
                  <TextCmp>{album.type}</TextCmp>
                  <TextCmp>{getYear(album.release_date)}</TextCmp>
                </View>
              </View> */}

              {/* <Pressable
                onPress={async () => {
                  try {
                    if (currentAlbumId === album.id) {
                      if (playing) {
                        await TrackPlayer.pause();
                        dispatch(setPlaying(false));
                      } else {
                        await TrackPlayer.play();
                        dispatch(setPlaying(true));
                      }
                    } else {
                      await playAlbum(album.id, token, dispatch, trackid, true);
                    }
                  } catch (error) {
                    console.error('Error handling album press:', error);
                  }
                }}>
                <Ionicons
                  name={
                    playing && currentAlbumId === album.id
                      ? 'pause-circle'
                      : 'play-circle'
                  }
                  color="#1ED760"
                  size={76}
                />
              </Pressable> */}
            {/* </View> */}

            <View style={styles.iconcontainer}>
              <Pressable
              >
                <Image
                  source={
                    // pressed
                    //   ? require('../assets/Images/Player/unlike.png')
                    require('../assets/Images/Player/like.png')
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
       

        <FlatList
          data={song}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View>{trackid && <Play />}</View>
    </LinearGradient>
  );
}





const styles=StyleSheet.create({
    // container:{
    //    backgroundColor: '#111111',
    //     flex:1,
      
    // },
   card: {
   
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
    width: '100%', 
    // justifyContent: 'space-between',
  },
   trackdesc: {
    flexDirection: 'row',
    marginHorizontal: horizontalScale(12),
    gap: 8,
   
  },
  track: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
   images: {
    width: horizontalScale(60),
    height: verticalScale(60),
    borderRadius: moderateScale(4),
    marginRight: horizontalScale(12),
  },
  desccard: {
    flex: 1,
  },
    dicon: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
    trackdesc: {
    flexDirection: 'row',
    marginHorizontal: horizontalScale(12),
    gap: 8,
    alignItems: 'center',
  },
  linearGradient:{
    flex:1
  },
   header: {
    flexDirection: 'row',
    marginVertical: verticalScale(50),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
   imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  
  iconcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: verticalScale(-5),
  },
    mainimage: {
    width: horizontalScale(234),
    height: verticalScale(236),
  },
  

});

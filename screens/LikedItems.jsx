import { StyleSheet, Text, View, FlatList,Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchSavedSongs} from '../utils/http';
import TextCmp from '../UI/SpText';
import { images } from '../assets/image';
import AntDesign from '@react-native-vector-icons/ant-design';
import { moderateScale,horizontalScale,verticalScale } from '../utils/fonts/fonts';


export default function LikedItems() {
  const token = useSelector(state => state.auth.token);
  const [song,setSongs]=useState([])
   useEffect(() => {
     const loadTracks = async () => {
       if (token) {
         try {
           const songs=await fetchSavedSongs(token)
           
            const extractedTracks = songs.items.map(item => item.track);
            console.log("Mapped!!",extractedTracks);
            
           setSongs(extractedTracks)
           
 
        
         } catch (err) {
           console.error('Error fetching album:', err);
         }
       }
     };
     loadTracks();
   }, [token]);

const renderItem = ({ item }) => (
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
);

 

  return (
    <View style={styles.container}>
     <FlatList
              data={song}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
    </View>
  );
}




const styles=StyleSheet.create({
    container:{
       backgroundColor: '#111111',
        flex:1,
      
    },
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

});

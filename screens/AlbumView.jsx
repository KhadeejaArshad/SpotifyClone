import {
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';

import {
 
  fetchAlbumView,
  fetchArtist,
 
} from '../utils/http';
import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import MediaView from '../components/View/View';

export default function AlbumView({route}) {
  const [album, setAlbum] = useState(null);


  const [track, setTrack] = useState(null);
  const [artist, setArtist] = useState(null);
  const dispatch = useDispatch();
  const id = route.params.id;
  const token = useSelector(state => state.auth.token);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadTracks = async () => {
      if (token && id) {
        setLoading(true);
        setAlbum(null);
        setTrack(null);
        setArtist(null);

        try {
          const data = await fetchAlbumView(id, token);
          console.log("vngfhj",data.tracks.items);
          
         
          
          const artistId = data.artists[0].id;
          const artistdata = await fetchArtist(artistId, token);

          setAlbum(data);
          setTrack(data.tracks.items);
          setArtist(artistdata);
        } catch (err) {
          console.error('Error fetching album:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTracks();
  }, [token, id]);

console.log(album);
if (loading || !album) {
  return (
    <LinearGradient
      colors={['#C63224', '#641D17', '#271513', '#121212']}
      style={styles.linearGradient}>
      <SafeAreaView style={styles.emptyState}>
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    </LinearGradient>
  );
}

  return (
  
     <MediaView data={album} type={'album'} artist={artist} colors={['#C63224', '#641D17', '#271513', '#121212']}/>
   
  
   
    
    
   
  );
}
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

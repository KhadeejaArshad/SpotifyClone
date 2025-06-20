import {StyleSheet, View, Text, FlatList,ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {fetchMyAlbum, fetchMyArtist, fetchMyPlayist,fetchSavedSongs} from '../utils/http';
import LibButton from '../components/Library/Button';
import Play from '../components/Play';
import List from '../components/Library/List';
import { horizontalScale,verticalScale,moderateScale } from '../utils/fonts/fonts';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const Library = () => {
  const token = useSelector(state => state.auth.token);
  const [libraryItems, setLibraryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const id = useSelector(state => state.player.currentTrack);
    const [song, setSongs] = useState([]);
    useFocusEffect(
  useCallback(() => {
    const loadLibrary = async () => {
      if (token) {
        try {
          const playlists = await fetchMyPlayist(token);
          const albums = await fetchMyAlbum(token);
          const artist = await fetchMyArtist(token);
          const songs = await fetchSavedSongs(token);

          const extractedTracks = songs.items.map(item => item.track);
          setSongs(extractedTracks);

          const playlistItems = playlists.items.map(item => ({
            ...item,
            type: 'playlist',
          }));

          const albumItems = albums.items.map(item => ({
            ...item.album,
            type: 'album',
          }));

          const artistItems = artist.map(item => ({
            ...item,
            type: 'artist',
          }));

          const allItems = [...playlistItems, ...albumItems, ...artistItems];
          setLibraryItems(allItems);
          setFilteredItems(allItems);
        } catch (err) {
          console.error('Error fetching library:', err);
        }
      }
    };

    loadLibrary();
  }, [token])
);


  const handleFilter = (type) => {
    setActiveFilter(type);
    if (type === null) {
      setFilteredItems(libraryItems); 
    } else {
      const filtered = libraryItems.filter(item => item.type === type);
      setFilteredItems(filtered);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.buttoncontainer}>
        <LibButton 
          onPress={() => handleFilter(null)}
          active={activeFilter === null}
        >
          All
        </LibButton>
        <LibButton 
          onPress={() => handleFilter('playlist')}
          active={activeFilter === 'playlist'}
        >
          Playlists
        </LibButton>
        <LibButton 
          onPress={() => handleFilter('album')}
          active={activeFilter === 'album'}
        >
          Albums
        </LibButton>
        <LibButton onPress={()=>handleFilter('artist')} active={activeFilter==='artist'}>Artists</LibButton>
      </View>

      {filteredItems.length > 0 ? (
       <List length={song.length} liked={song}data={filteredItems}/>
      ) : (
        <View style={styles.emptyState}>
        <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
        </View>
      )}

      {id && <Play />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',

  },
  buttoncontainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: verticalScale(16),
    flexWrap: 'wrap',
  },
  listContainer: {
    paddingBottom: verticalScale(80), 
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.7,
  },
});

export default Library;
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  fetchMyAlbum,
  fetchMyArtist,
  fetchMyPlayist,
  fetchSavedSongs,
} from '../utils/http';
import LibButton from '../components/Library/Button';
import Play from '../components/Play';
import List from '../components/Library/List';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

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
        if (!token) return;

        try {
          let playlists = [];
          let albums = [];
          let artists = [];
          let likedSongs = [];

          try {
            const playlistRes = await fetchMyPlayist(token);
            playlists =
              playlistRes?.items?.map(item => ({
                ...item,
                type: 'playlist',
              })) || [];
          } catch (err) {
            console.log('Playlist fetch failed');
          }

          try {
            const albumRes = await fetchMyAlbum(token);
            albums =
              albumRes?.items?.map(item => ({
                ...item.album,
                type: 'album',
              })) || [];
          } catch (err) {
            console.log('Album fetch failed');
          }

          try {
            const artistRes = await fetchMyArtist(token);
            artists =
              artistRes.map(item => ({
                ...item,
                type: 'artist',
              })) || [];
          } catch (err) {
            console.log('Artist fetch failed');
          }

          try {
            const savedRes = await fetchSavedSongs(token);
            likedSongs = savedRes?.items?.map(item => item.track) || [];
          } catch (err) {
            console.log('Saved songs fetch failed');
          }

          setSongs(likedSongs);

          const allItems = [...playlists, ...albums, ...artists];
          setLibraryItems(allItems);
          setFilteredItems(allItems);
        } catch (err) {
          console.error('Unexpected error loading library:', err);
        }
      };

      loadLibrary();
    }, [token]),
  );

  const handleFilter = type => {
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
          active={activeFilter === null}>
          All
        </LibButton>
        <LibButton
          onPress={() => handleFilter('playlist')}
          active={activeFilter === 'playlist'}>
          Playlists
        </LibButton>
        <LibButton
          onPress={() => handleFilter('album')}
          active={activeFilter === 'album'}>
          Albums
        </LibButton>
        <LibButton
          onPress={() => handleFilter('artist')}
          active={activeFilter === 'artist'}>
          Artists
        </LibButton>
      </View>

      {filteredItems.length > 0 ? (
        <List length={song.length} liked={song} data={filteredItems} />
      ) : libraryItems.length === 0 && song.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.debugText}>Welcome, new user!</Text>
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      )}

      {id && (
        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
          <Play />
        </View>
      )}
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
    gap: scale(10),
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
    fontSize: moderateScale(16),
    opacity: 0.7,
  },
  debugText: {
  color: 'white',
  fontSize: moderateScale(16),
  marginTop: verticalScale(20),
  fontWeight: '600',
},

});

export default Library;

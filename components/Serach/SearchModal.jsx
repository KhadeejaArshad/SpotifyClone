import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import {fonts} from '../../utils/fonts';
import {useState, useEffect} from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {searchSpotify} from '../../utils/http';
import {setcurTrack} from '../../store/track';
import TextCmp from '../../UI/SpText';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

export default function SearchModal({visible, setVisible}) {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetch = async () => {
      if (query.length > 2) {
        const data = await searchSpotify(query, token);
        if (data) {
          setResults(data);
        }
      } else {
        setResults([]);
      }
    };

    fetch();
  }, [query]);

  const renderItem = ({item}) => {
    switch (item.type) {
      case 'album':
        return <AlbumCard item={item} />;
      case 'track':
        return <TrackCard item={item} />;
      case 'playlist':
        return <PlaylistCard item={item} />;
      case 'artist':
        return <ArtistCard item={item} />;
    }
  };

  const navigation = useNavigation();

  const TrackCard = ({item}) => (
    <Pressable
      onPress={() => {
        dispatch(setcurTrack(item.id));
      }}>
      <View style={styles.card}>
        <Image
          style={styles.image}
          source={{uri: item.album?.images?.[0]?.url}}
        />
        <View>
          <TextCmp>{item.name}</TextCmp>
          <View style={styles.desc}>
            <View
              style={{
                backgroundColor: 'gray',
                width: scale(13),
                height: scale(13),
                borderRadius: moderateScale(2),
                alignItems: 'center',
              }}>
              <TextCmp size={10} weight="Demi">
                E
              </TextCmp>
            </View>
            <TextCmp size={12} color="grey">
              Song.
            </TextCmp>
            <TextCmp size={12} color="gray">
              {item.artists?.[0]?.name}
            </TextCmp>
          </View>
        </View>
      </View>
    </Pressable>
  );
  const AlbumCard = ({item}) => (
    <Pressable
      onPress={() => {
        navigation.navigate('AlbumView', {id: item.id});
        setVisible(false);
      }}>
      <View style={styles.card}>
        <Image style={styles.image} source={{uri: item?.images?.[0]?.url}} />
        <View>
          <TextCmp>{item.name}</TextCmp>
          <View style={styles.desc}>
            <TextCmp color="gray" size={12}>
              Album.
            </TextCmp>
            <TextCmp color="gray" size={12}>
              {item.artists?.[0]?.name}
            </TextCmp>
          </View>
        </View>
      </View>
    </Pressable>
  );
  const PlaylistCard = ({item}) => (
    <Pressable
      onPress={() => {
        navigation.navigate('PlaylistView', {id: item.id});
        setVisible(false);
      }}>
      <View style={styles.card}>
        <Image style={styles.image} source={{uri: item?.images?.[0]?.url}} />
        <View>
          <TextCmp>{item.name}</TextCmp>
          <View style={styles.desc}>
            <TextCmp color="gray" size={12}>
              Playlist.
            </TextCmp>
            <TextCmp color="gray" size={12}>
              {item.owner?.display_name}
            </TextCmp>
          </View>
        </View>
      </View>
    </Pressable>
  );
  const ArtistCard = ({item}) => (
    <Pressable
      onPress={() => {
        navigation.navigate('ArtistView', {id: item.id});
        setVisible(false);
      }}>
      <View style={styles.card}>
        <Image
          style={[styles.image, {borderRadius: moderateScale(999)}]}
          source={{uri: item?.images?.[0]?.url}}
        />
        <View>
          <TextCmp>{item.name}</TextCmp>
          <TextCmp color="gray" size={12}>
            Artist
          </TextCmp>
        </View>
      </View>
    </Pressable>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modal}>
        <View style={styles.searchbar}>
          <View style={styles.modalContent}>
            <Ionicons
              style={styles.icon}
              name="search"
              color="white"
              size={24}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Search"
              placeholderTextColor="white"
              autoFocus
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <Pressable onPress={() => setVisible(false)}>
            <TextCmp marginH={8} weight="medium">
              Cancel
            </TextCmp>
          </Pressable>
        </View>

        <View>
          <TextCmp weight="Demi" marginV={25} marginH={10} size={17}>
            Recent Searches
          </TextCmp>
        </View>
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 100}}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: '#282828',
    borderRadius: moderateScale(12),
    height: verticalScale(40),
    width: '85%',
    fontSize: moderateScale(28),
  },
  searchbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(60),
    marginHorizontal: scale(13),
  },
  modal: {
    flex: 1,
    backgroundColor: '#111111',
  },
  icon: {
    marginHorizontal: scale(8),
  },

  image: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(50) / 2,
  },
  card: {
    padding: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  modalInput: {
    color: 'white',
  },
  desc: {
    flexDirection: 'row',
    gap: scale(4),
  },
});

import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Modal,
  Text,
  Image,
} from 'react-native';
import React from 'react';
import List from '../components/SearchComponent/List';
import Ionicons from '@react-native-vector-icons/ionicons';
import Play from '../components/Play';
import {useState} from 'react';
import {fonts} from '../utils/fonts';

import {useDispatch} from 'react-redux';
import { useSelector } from 'react-redux';
import SearchModal from '../components/Serach/SearchModal';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const Search = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
    const id = useSelector(state => state.player.currentTrack);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}>
        <View style={styles.search}>
          <Ionicons style={styles.icon} name="search" color="black" size={moderateScale(25)} />

          <TextInput
            style={styles.input}
            placeholder="Artists, songs, or podcasts"
            placeholderTextColor="#000"
            editable={false}
            pointerEvents="none"
          />
        </View>
      </Pressable>

      <SearchModal visible={modalVisible} setVisible={setModalVisible} />

      <List />
    
      {id && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <Play />
        </View>
      )}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  search: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: moderateScale(8),
    marginHorizontal: scale(8),
    height: verticalScale(46),
  },
  input: {
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
  },
  icon: {
    marginHorizontal: scale(10),
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#282828',
    borderRadius: moderateScale(12),
    height: verticalScale(40),
    width: scale(350),
  },
  searchbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  modal: {
    flex: 1,
    backgroundColor: '#111111',
  },
  icon: {
    marginHorizontal: scale(8),
  },
  cancel: {
    color: 'white',
    marginHorizontal: scale(8),
    fontFamily: fonts.medium,
  },
  heading: {
    color: 'white',
    fontFamily: fonts.Demi,
    marginVertical: 25,
    fontSize: 17,
    marginHorizontal: 10,
  },
  image: {
    width: scale(50),
    height: scale(50),
    borderRadius: moderateScale(25),
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

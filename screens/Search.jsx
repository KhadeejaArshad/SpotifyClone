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
import { verticalScale,moderateScale,horizontalScale } from '../utils/fonts/fonts';

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
          <Ionicons style={styles.icon} name="search" color="black" size={25} />

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
      {id && <Play />}
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
    marginHorizontal: horizontalScale(8),
    height: verticalScale(46),
  },
  input: {
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
  },
  icon: {
    marginHorizontal: horizontalScale(10),
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#282828',
    borderRadius: moderateScale(12),
    height: verticalScale(40),
    width: horizontalScale(350),
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
    marginHorizontal: horizontalScale(8),
  },
  cancel: {
    color: 'white',
    marginHorizontal: horizontalScale(8),
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
    width: horizontalScale(50),
    height: verticalScale(50),
    borderRadius: moderateScale(25),
  },
  card: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalInput: {
    color: 'white',
  },
  desc: {
    flexDirection: 'row',
    gap: 4,
  },
});

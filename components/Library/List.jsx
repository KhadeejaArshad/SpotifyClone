import {StyleSheet, FlatList, View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import PinnedItem from './PinnedItem';
import UpperTab from './tab';
import {images} from '../../assets/image';
import {useNavigation} from '@react-navigation/native';
import TextCmp from '../../UI/SpText';
import {
  verticalScale,
  scale,
  moderateScale,
} from '../../utils/fonts/fonts';

export default function List({data,length,liked}) {

 

  const navigation = useNavigation();

  const renderItem = ({item}) => {
    const onPressHandler = () => {
      if (item.type === 'playlist') {
        navigation.navigate('PlaylistView', {id: item.id});
      } else if (item.type === 'album') {
        navigation.navigate('AlbumView', {id: item.id});
      } else if (item.type === 'artist') {
        navigation.navigate('ArtistView', {id: item.id});
      }
    };

    return (
      <Pressable onPress={onPressHandler}>
        <View style={styles.item}>
          {item?.images?.[0]?.url && (
            <Image source={{uri: item?.images[0]?.url}} style={styles.image} />
          )}
          <View style={styles.desc}>
            <TextCmp size={16} width={250} weight="Demi">
              {item.name}
            </TextCmp>
            <TextCmp color="#B3B3B3">
              {item.type === 'playlist'
                ? `Playlist. ${item.owner?.display_name}`
                : item.type === 'album'
                ? `Album. ${item.artists?.[0]?.name}`
                : 'Artist'}
            </TextCmp>
          </View>
        </View>
      </Pressable>
    );
  };
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ListHeaderComponent={() => (
        <>
          <UpperTab />
          <PinnedItem
            data={liked}
            image={images.pin1}
            text={'Liked Songs'}
            subtext={`Playlist.${length} songs`}
          />
          <PinnedItem
          data={liked}
            image={images.pin2}
            text={'New Episodes'}
            subtext={'Updated 2 days ago '}
          />
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginVertical: verticalScale(16),
    alignItems: 'center',
    marginHorizontal: scale(8),
  },
  desc: {
    marginHorizontal: scale(10),
  },

  icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  song: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  image: {
    width: scale(65),
    height: scale(65),
  },
});

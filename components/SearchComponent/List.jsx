import {StyleSheet, Text, View, SectionList, Image} from 'react-native';
import React, { useEffect, useState } from 'react';

import TextCmp from '../../UI/SpText';
import { verticalScale,horizontalScale,moderateScale } from '../../utils/fonts/fonts';
import { fetchCategories } from '../../utils/http';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';

export default function List() {
  const token = useSelector(state => state.auth.token);
  const [categories,setcategories]=useState([]);

  
    
  

  useEffect(() => {
    async function loadcategories() {
      const category = await fetchCategories(token);
      console.log(category.categories.items);
      setcategories(category.categories.items);
    }

    if (token) {
      loadcategories();
    }
  }, [token]);

const renderItem = ({ item }) => {
  const randomColor = `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
  
  return (
    <View style={[styles.item, { backgroundColor: randomColor }]}>
      <TextCmp
        size={16}
        weight="bold"
        marginV={8}
        marginH={10}
        width={80}>
        {item.name}
      </TextCmp>
      <View>
        <Image
          source={{ uri: item.icons[0]?.url }}
          style={styles.image}
        />
      </View>
    </View>
  );
};

  

  return (
    <View>
       <TextCmp size={18} marginT={15} marginH={14} weight='Demi' style={styles.header}>Categories for you</TextCmp>
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      
      contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 20 }}
      showsVerticalScrollIndicator={false}
    />

    </View>
    
  );
}
  // function chunkArray(arr, size) {
  //   const result = [];
  //   for (let i = 0; i < arr.length; i += size) {
  //     result.push(arr.slice(i, i + size));
  //   }
  //   return result;
  // }

    // <SectionList
    //   sections={DATA.map(section => ({
    //     ...section,
    //     data: chunkArray(section.data, 2),
    //   }))}
    //   keyExtractor={(item, index) => index.toString()}
    //   renderItem={({item}) => (
    //     <View style={styles.row}>
    //       {item.map((entry, index) => (
    //         <View
    //           key={index}
    //           style={[styles.item, {backgroundColor: entry.color}]}>
    //           <TextCmp size={16} weight='bold' marginV={8} marginH={10} width={80}>{entry.title}</TextCmp>
    //           <View>
    //             <Image style={styles.image} source={entry.image} />
    //             </View>
    //         </View>
    //       ))}
    //     </View>
    //   )}
    //   renderSectionHeader={({section: {title}}) => (
    //     <TextCmp size={16} marginV={20} marginH={14} weight='Demi' style={styles.header}>{title}</TextCmp>
    //   )}
    // />
 
  


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(12),
    marginBottom: verticalScale(12),
  },
  item: {
    flex: 1,
    marginHorizontal: horizontalScale(6),
    width: horizontalScale(192),
    height: verticalScale(109),
    borderRadius: moderateScale(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow:'hidden',
    marginVertical:verticalScale(10)
  },


  image:{
    marginVertical:verticalScale(55),
    marginHorizontal:horizontalScale(-9),
    width:65,
    height:65,
    transform:[{rotate:'20deg'}]
  }
});

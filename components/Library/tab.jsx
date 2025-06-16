import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AntDesign from '@react-native-vector-icons/ant-design';

import TextCmp from '../../UI/SpText';
import { verticalScale,moderateScale,horizontalScale } from '../../utils/fonts/fonts';

export default function UpperTab() {
  return (
    <View style={styles.tab}>
      <View style={styles.icon}>
        <AntDesign name="arrow-down" color="white" />
        <AntDesign name="arrow-up" color="white" />
        <TextCmp weight='Demi'>Recently played</TextCmp>
      </View>
      <AntDesign name="appstore" color="white" size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(16),
    marginHorizontal: horizontalScale(8),
  },

});

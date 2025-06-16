import { StyleSheet,View,Text,Pressable } from "react-native";
import TextCmp from "../../UI/SpText";
import { verticalScale,moderateScale,horizontalScale } from "../../utils/fonts/fonts";
export default function LibButton({children, onPress, active = false}) {
  return (
    <View style={[
      styles.buttonOuterContainer,
      active && styles.activeButton
    ]}>
      <Pressable onPress={onPress}>
        <TextCmp alignment="center" size={12}>{children}</TextCmp>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderColor: '#7F7F7F',
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    borderColor: '#1ED760',
    backgroundColor: '#1ED76020',
  },

});
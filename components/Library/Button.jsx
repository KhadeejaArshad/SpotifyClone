import { StyleSheet,View,Text,Pressable } from "react-native";
import TextCmp from "../../UI/SpText";
import { verticalScale,moderateScale,scale } from "../../utils/fonts/fonts";
export default function LibButton({children, onPress, active = false}) {
  return (
    <View style={[
      styles.buttonOuterContainer,
      active && styles.activeButton
    ]}>
      <Pressable onPress={onPress}>
        <TextCmp alignment="center" color={active ? 'black' : 'white'} weight="Demi" size={12}>{children}</TextCmp>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonOuterContainer: {
    backgroundColor: '#292828',
    marginTop:verticalScale(10),
    
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#1ED760',
    
   
    
  },

});
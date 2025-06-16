import { StyleSheet, Text as SpText } from 'react-native';
import { fonts } from '../utils/fonts';
import { verticalScale, horizontalScale, moderateScale } from '../utils/fonts/fonts';

const TextCmp = ({
  children,
  weight = 'regular',
  size = 14,
  color = 'white',
  alignment = 'left',
  marginH = 2,
  marginV,
  width,
  marginT
}) => {
  const styleArray = [styles.text];

  if (styles[weight]) styleArray.push(styles[weight]);
  if (size) styleArray.push({ fontSize: moderateScale(size) });
  if (color) styleArray.push({ color });
  if (alignment) styleArray.push({ textAlign: alignment });
  if (marginH !== undefined || marginV !== undefined) {
    styleArray.push({
      marginHorizontal: horizontalScale(marginH || 0),
      marginVertical: verticalScale(marginV || 0)
    });
  }
  if (width !== undefined) styleArray.push({ width });
  if (marginT !== undefined) styleArray.push({ marginTop: verticalScale(marginT) });

  return <SpText style={styleArray}>{children}</SpText>;
};

export default TextCmp;


const styles = StyleSheet.create({
    text:{

    },
    regular:{
        fontFamily:fonts.regular
    },
    bold:{
        fontFamily:fonts.bold
    },
    medium:{
        fontFamily:fonts.medium
    },
    Demi:{
        fontFamily:fonts.Demi

    },


})
import { Dimensions, Platform } from 'react-native';


const { width, height } = Dimensions.get('window');


const guidelineBaseWidth = 428;
const guidelineBaseHeight = 926;

const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => 
  size + (horizontalScale(size) - size) * factor;

export { horizontalScale, verticalScale, moderateScale };
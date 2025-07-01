import { Dimensions, Platform } from 'react-native';


const { width, height } = Dimensions.get('window');


const guidelineBaseWidth = 428;
const guidelineBaseHeight = 926;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 1) => 
  size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
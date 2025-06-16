import {authorize} from 'react-native-app-auth';
import { authConfig } from './auth-config';

export const loginToSpotify = async () => {
  try {
    const result = await authorize(authConfig);
    console.log(result)
    return result;
  } catch (error) {
    console.error('Spotify login failed', error);
    throw error;
  }
};
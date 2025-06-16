import {refresh} from 'react-native-app-auth';
import {authConfig} from './auth/auth-config';
import {isAuthenticate, setExpireTime, setRefreshToken} from '../store/authenticate';

export const refreshSpotifyToken = () => async (dispatch, getState) => {
  const {refreshToken} = getState().auth;

  if (!refreshToken) {
    console.warn('No refresh token available.');
    return null;
  }

  try {
    const result = await refresh(authConfig, {
      refreshToken,
    });

    dispatch(isAuthenticate(result.accessToken));
    dispatch(setExpireTime(result.accessTokenExpirationDate));
    dispatch(setRefreshToken(result.refreshToken))

    return result.accessToken;
  } catch (error) {
    console.error('Failed to refresh Spotify token:', error);
    dispatch(isAuthenticate(null));
    dispatch(setExpireTime(null));
    
    dispatch(setRefreshToken(null));

    return null;
  }
};

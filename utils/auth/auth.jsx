import {authorize} from 'react-native-app-auth';
import {authConfig} from './auth-config';
import axios from 'axios';
import InAppBrowser from 'react-native-inappbrowser-reborn';

// export const loginToSpotify = async () => {
//   try {
//     const result = await authorize(authConfig);
//     console.log(result)
//     return result;
//   } catch (error) {
//     console.error('Spotify login failed', error);
//     throw error;
//   }
// };

export const handleOpenInAppBrowser = async () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${
    authConfig.clientId
  }&redirect_uri=${authConfig.redirectUrl}&response_type=code&scope=${
    authConfig.scopes
  }&show_dialog=${true}`;
  try {
    const response = await InAppBrowser.openAuth(
      authUrl,
      authConfig.redirectUrl,
      {},
    );
    console.log(response);

    let code = response.url.split('code=')[1];
    console.log(code, 'code');

    if (code) {
      const res = await getAccessToken(code);
      return res;
    }
  } catch (error) {
    console.log('Error opening InAppBrowser:', error);
  }
};

export const getAccessToken = async code => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', authConfig.redirectUrl);

  const authString = `${authConfig.clientId}:${authConfig.clientSecret}`;
  const encodedAuth = btoa(authString);
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

export const loginToSpotifywithoutuser = async () => {
 

  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('client_id', authConfig.clientId);
  data.append('client_secret', authConfig.clientSecret);

  try {
    const result = await axios.post(
      'https://accounts.spotify.com/api/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encodedAuth}`,
        },
      },
    );
    return result.data;
  } catch (error) {
    console.log('Spotify login failed', error.response?.data);
  }
};

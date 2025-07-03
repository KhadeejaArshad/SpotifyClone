import {authorize} from 'react-native-app-auth';
import {authConfig} from './auth-config';
import axios from 'axios';

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

export const loginToSpotify = async () => {
  const clientId = 'your-client-id';
  const clientSecret = 'your-client-secret';

  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('client_id', authConfig.clientId);
  data.append('client_secret', authConfig.clientSecret);

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      data.toString(), // Important: send as a URL-encoded string
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      'Spotify login failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

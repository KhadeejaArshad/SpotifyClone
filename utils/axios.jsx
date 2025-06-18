import axios from 'axios';
import { store } from '../store/store';
import { refreshSpotifyToken } from './refresh';
import { logout } from '../store/authenticate';
import { navigate } from './Navigationservice';

const spotifyAPI = axios.create({
  baseURL: 'https://api.spotify.com/v1',
});


spotifyAPI.interceptors.request.use(
  async config => {
    const state = store.getState();
    const accessToken = state.auth.token;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => Promise.reject(error),
);





spotifyAPI.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const result = await store.dispatch(refreshSpotifyToken());
      const newAccessToken = store.getState().auth.token;

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return spotifyAPI(originalRequest);
      } else {
        
        dispatch(logout());
       
        navigate('login');
      }
    }

    return Promise.reject(error);
  }
);


export default spotifyAPI;

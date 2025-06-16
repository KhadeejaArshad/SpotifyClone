

export const authConfig = {
  clientId: '94350b08c7a845ea9739ed1471ede39a',
  clientSecret: '383a476a6d784e299cb4d78292718a21',
  redirectUrl: 'myspotify://callback',
  scopes: [
    'user-read-email',
    'user-read-private',
    'playlist-read-private',
    'user-library-read',
     'user-read-recently-played',
     'user-follow-read'
  ],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  },
};
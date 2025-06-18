export async function getProfile(token) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`,

    },
  });

  const data = await response.json();
  return data
}

import spotifyAPI from './axios';

export const fetchRecentlyPlayedAlbums = async accessToken => {
  const fallbackalbums = [
    '5dGWwsZ9iB2Xc3UKR0gif2',
    '1pzvBxYgT6OVwJLtHkrdQK',
    '43wFM1HquliY3iwKWzPN4y',
    '6nYfHQnvkvOTNHnOhDT3sr',
    '2up3OPMp9Tb4dAKM2erWXQ',
    '1A2GTWGtFfWp7KSQTwWOyo',
    '2noRn2Aes5aoNVsU6iWThc',
    '4aawyAB9vmqN3uQ7FjRGTy',
    '382ObEPsp2rxGrnsizN5TX',
  ];

  try {
    const res = await spotifyAPI.get('/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 50,
      },
    });

    const albumsMap = new Map();

    res.data.items.forEach(item => {
      const album = item.track.album;

      if (!albumsMap.has(album.id)) {
        albumsMap.set(album.id, {
          id: album.id,
          image: {uri: album?.images[0]?.url},
          title: album.name,
          artist: album.artists.map(a => a.name).join(', '),
        });
      }
    });

    return Array.from(albumsMap.values());
  } catch (error) {
    console.error(
      'Failed to fetch recently played albums:',
      error.response?.data || error.message,
    );
    return [];
  }
};

export const fetchRecentlyPlayedArtists = async accessToken => {
  const fallbackArtistIds = [
    '1uNFoZAHBGtllmzznpCI3s',
    '06HL4z0CvFAxyc27GXpf02',
    '3TVXtAsR1Inumwj472S9r4',
    '66CXWjxzNUsdJxJ2JdwvnR',
    '3Nrfpe0tUJi4K4DXYWgMUX',
    '1Xyo4u8uXC1ZmMpatF05PJ',
    '0TnOYISbd1XYRBk9myaseg',
  ];

  try {
    const res = await spotifyAPI.get('/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 20,
      },
    });

    const artistMap = {};
    res.data.items.forEach(item => {
      const artist = item.track.artists?.[0];
      if (artist && !artistMap[artist.id]) {
        artistMap[artist.id] = artist.name;
      }
    });

    const artistIds = Object.keys(artistMap);
    const idsToUse = artistIds.length > 0 ? artistIds : fallbackArtistIds;

    const artistRes = await spotifyAPI.get('/artists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        ids: idsToUse.join(','),
      },
    });

    return artistRes.data.artists.map(artist => ({
      id: artist.id,
      name: artist.name,
      image: {uri: artist?.images?.[0]?.url},
    }));
  } catch (error) {
    console.error(
      'Failed to fetch recently played artists:',
      error?.response?.data || error.message,
    );

    try {
      const fallbackRes = await spotifyAPI.get('/artists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          ids: fallbackArtistIds.join(','),
        },
      });

      return fallbackRes.data.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        image: {uri: artist?.images?.[0]?.url},
      }));
    } catch (fallbackError) {
      console.error(
        'Fallback artist fetch failed:',
        fallbackError?.response?.data || fallbackError.message,
      );
      return [];
    }
  }
};

export async function fetchAlbumView(id, accesstoken) {
  try {
    const res = await spotifyAPI.get(`/albums/${id}`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      'Failed to fetch album details:',
      error.response?.data || error.message,
    );
  }
}
export async function fetchArtist(id, accesstoken) {
  try {
    const res = await spotifyAPI.get(`/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      'Failed to fetch album details:',
      error.response?.data || error.message,
    );
  }
}
export async function fetchPlaylist(id, accesstoken) {
  try {
    const res = await spotifyAPI.get(`/playlists/${id}`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      'Failed to fetch album details:',
      error.response?.data || error.message,
    );
  }
}

export async function fetchAlbumTrack(id, accesstoken) {
  try {
    const res = await spotifyAPI.get(`/albums/${id}/tracks`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      'Failed to fetch album details:',
      error.response?.data || error.message,
    );
  }
}
export async function fetchTrack(accesstoken) {
  try {
    const res = await spotifyAPI.get(`/me/player/recently-played?limit=20`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    const tracksMap = new Map();

    res.data.items.forEach(item => {
      const track = item.track;
      if (!track?.id) return;

      const durationMs = track.duration_ms;
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000)
        .toString()
        .padStart(2, '0');

      if (!tracksMap.has(track.id)) {
        tracksMap.set(track.id, {
          id: track.id,
          name: track.name,
          artist: track.artists[0]?.name,
          image: track.album.images[0]?.url,
          album: track.album.name,
          duration: `${minutes}:${seconds}`,

          played_at: item.played_at,
        });
      }
    });

    return Array.from(tracksMap.values());
  } catch (error) {
    console.error(
      'Failed to fetch recently played tracks:',
      error.response?.data || error.message,
    );
    return [];
  }
}

export async function getcurrentTrack(accesstoken, id) {
  try {
    const res = await spotifyAPI.get(`/tracks/${id}`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      'Failed to fetch album details:',
      error.response?.data || error.message,
    );
  }
}
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const searchSpotify = async (query, token) => {
  try {
    const response = await spotifyAPI.get('/search', {
      params: {
        q: query,
        type: 'track,artist,album,playlist,show,',
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const tracks = (response.data.tracks?.items || []).map(item => ({
      ...item,
      type: 'track',
    }));
    const albums = (response.data.albums?.items || []).map(item => ({
      ...item,
      type: 'album',
    }));
    const playlists = (response.data.playlists?.items || []).map(item => ({
      ...item,
      type: 'playlist',
    }));
    const artists = (response.data.artists?.items || []).map(item => ({
      ...item,
      type: 'artist',
    }));

    // Combine and shuffle
    const combined = [...tracks, ...albums, ...playlists, ...artists];
    const shuffled = shuffleArray(combined);
    return shuffled.filter(item => item && item.id);
  } catch (error) {
    console.error(
      'Spotify search failed:',
      error.response?.data || error.message,
    );
    return;
  }
};

export async function fetchArtistTrack(id, accesstoken) {
  try {
    const res = await spotifyAPI.get(`/artists/${id}/albums`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      'Failed to fetch album details:',
      error.response?.data || error.message,
    );
  }
}

export async function fetchMyPlayist(accesstoken) {
  try {
    const res = await spotifyAPI.get(`/me/playlists`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      'Failed to fetch album details:',
      error.response?.data || error.message,
    );
  }
}

export async function fetchMyAlbum(accesstoken) {
  try {
    const res = await spotifyAPI.get(`/me/albums`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      'Failed to fetch album details:',
      error.response?.data || error.message,
    );
  }
}
export async function fetchMyArtist(accesstoken) {
  try {
    const res = await spotifyAPI.get('/me/following', {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
      params: {
        type: 'artist',
      },
    });

    return res.data.artists?.items || [];
  } catch (error) {
    console.error(
      'Failed to fetch followed artists:',
      error.response?.data || error.message,
    );
    return [];
  }
}

import TrackPlayer from 'react-native-track-player';
import {addTracks} from './trackPlayer';
import {
  setTrackList,
  setcurrAlbum,
  setPlaying,
  setcurTrack,
} from '../store/track';

export async function playAlbum(
  albumId,
  token,
  dispatch,
  selectedTrackId = null,
  shouldDispatch = true,
) {
  await TrackPlayer.reset();

  const tracks = await fetchAlbumTrack(albumId, token);

  const formattedTracks = tracks.items.map((track, index) => ({
    id: track.id || `track-${index}`,
    url: 'https://p.scdn.co/mp3-preview/e2e03acfd38d7cfa2baa924e0e9c7a80f9b49137?cid=8897482848704f2a8f8d7c79726a70d4',
    title: track.name,
    artist: track.artists?.[0]?.name || 'Unknown',
    duration: 30,
  }));

  await addTracks(formattedTracks);

  let startIndex = 0;
  if (selectedTrackId) {
    const index = formattedTracks.findIndex(t => t.id === selectedTrackId);
    if (index !== -1) {
      startIndex = index;

      await TrackPlayer.skip(formattedTracks[startIndex].id);
    }
  }

  await TrackPlayer.play();

  if (shouldDispatch) {
    dispatch(setTrackList(formattedTracks));
    dispatch(setcurrAlbum(albumId));
    dispatch(setcurTrack(formattedTracks[startIndex].id));
    dispatch(setPlaying(true));
  }
}

export async function playTrack(id, token) {
  const tracks = await getcurrentTrack(id, token);
 

  
}
export async function fetchCategories(accesstoken) {
  try {
    const res = await spotifyAPI.get(`/browse/categories`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
       params: {
        locale: 'en_US',
        limit: 16
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      'Failed to fetch album details:',
      error.response?.data || error.message,
    );
  }
}

export async function fetchLiked(accesstoken, id) {
  try {
    const res = await spotifyAPI.get(`/me/tracks/contains?ids=${id}`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    return res.data[0];
  } catch (error) {
    console.error('Failed to fetch', error.response?.data || error.message);
    return [];
  }
}
export async function fetchSavedSongs(accesstoken) {
  try {
    const res = await spotifyAPI.get(`/me/tracks`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
       params: {
        market: 'ES',
        limit: 10,
        offsett:5
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      'Failed to fetch album details:',
      error.response?.data || error.message,
    );
  }
}


export async function playPlaylist(
  playlistId,
  token,
  dispatch,
  selectedTrackId = null,
  shouldDispatch = true
) {
  await TrackPlayer.reset();

  const tracks = await fetchPlaylist(playlistId, token); 
  const items=tracks.tracks.items;
  

  const formattedTracks = items.map((item, index) => {
    const track = item.track;
    return {
      id: track.id || `track-${index}`,
      url: 'https://p.scdn.co/mp3-preview/e2e03acfd38d7cfa2baa924e0e9c7a80f9b49137?cid=8897482848704f2a8f8d7c79726a70d4',
      title: track.name,
      artist: track.artists?.[0]?.name || 'Unknown',
      duration: 30,
    };
  });

  await addTracks(formattedTracks);

  let startIndex = 0;
  if (selectedTrackId) {
    const index = formattedTracks.findIndex(t => t.id === selectedTrackId);
    if (index !== -1) {
      startIndex = index;
      await TrackPlayer.skip(formattedTracks[startIndex].id);
    }
  }

  await TrackPlayer.play();

  if (shouldDispatch) {
    dispatch(setTrackList(formattedTracks));
    dispatch(setcurrAlbum(playlistId)); 
    dispatch(setcurTrack(formattedTracks[startIndex].id));
    dispatch(setPlaying(true));
  }
}

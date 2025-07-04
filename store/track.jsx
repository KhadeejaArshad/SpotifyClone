import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null,
  isPlaying: false,
  trackList: [],
  currentAlbum: null,
  currentPlaylist: null,
  source: null,
};

const playerSlice = createSlice({
  name: 'Player',
  initialState,
  reducers: {
    setcurTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setTrackList: (state, action) => {
      state.trackList = action.payload;
    },
    setcurrAlbum: (state, action) => {
      state.currentAlbum = action.payload;
    },
    setcurrPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
    },
    resetPlayer: () => initialState,
  
  setSource: (state, action) => {
    state.source = action.payload;
  }
}
});

export const {
  setcurTrack,
  setPlaying,
  setTrackList,
  setcurrAlbum,
  setcurrPlaylist,
  resetPlayer,
  incrementLikesVersion,
  setSource
} = playerSlice.actions;

export default playerSlice.reducer;

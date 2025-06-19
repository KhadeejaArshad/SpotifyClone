import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null,
  isPlaying: false,
  trackList: [],
  currentAlbum: null,
  curOpenAlbum: null,
  likesVersion: 0,

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
    setOpenAlbum: (state, action) => {
      state.curOpenAlbum = action.payload;
    },
    resetPlayer: () => initialState,
  },
  incrementLikesVersion: state => {
      state.likesVersion += 1;
    },
   
  },
);

export const {
  setcurTrack,
  setPlaying,
  setTrackList,
  setcurrAlbum,
  setOpenAlbum,
  resetPlayer,
  incrementLikesVersion

} = playerSlice.actions;

export default playerSlice.reducer;

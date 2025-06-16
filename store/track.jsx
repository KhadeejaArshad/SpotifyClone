import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null,
  isPlaying: false,
  trackList: [],
  currentAlbum: null,
  curOpenAlbum: null,
  favourite: [],
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
  addFavorite: (state, action) => {
    state.favourite.push(action.payload.id);
  },
  removeFavourite: (state, action) => {
    state.favourite.splice(state.favourite.indexOf(action.payload.id), 1);
  },
});

export const {
  setcurTrack,
  setPlaying,
  setTrackList,
  setcurrAlbum,
  setOpenAlbum,
  resetPlayer,
  addFavorite,
  removeFavourite,
} = playerSlice.actions;

export default playerSlice.reducer;

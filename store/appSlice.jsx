
import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    recents: false,
    editors: false,
    wrap: false,
  },
  reducers: {
    setRecentsLoading: (state, action) => {
      state.recents = action.payload;
    },
    setEditorsLoading: (state, action) => {
      state.editors = action.payload;
    },
    setWrapLoading: (state, action) => {
      state.wrap = action.payload;
    },
  },
});

export const {
  setRecentsLoading,
  setEditorsLoading,
  setWrapLoading,
} = loadingSlice.actions;

export default loadingSlice.reducer;


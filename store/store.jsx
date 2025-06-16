import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import  authSlice  from "./authenticate";
import playerSlice from './track'
import loadingSlice from './appSlice'
const rootReducer = combineReducers({
  auth: authSlice,
  player:playerSlice,
  loading:loadingSlice
});


const persistConfig = {
  key: "root",
  storage:AsyncStorage,

};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import weatherReducer from './weatherSlice';
import favoritesReducer from './favoritesSlice';
import unitsReducer from './unitsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['favorites', 'units'],
};

const rootReducer = combineReducers({
  weather: weatherReducer,
  favorites: favoritesReducer,
  units: unitsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
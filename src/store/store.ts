import { configureStore } from '@reduxjs/toolkit';
import submissionsReducer from './submissionsSlice';
import countriesReducer from './countriesSlice';

export const setupStore = () =>
  configureStore({
    reducer: {
      submissions: submissionsReducer,
      countries: countriesReducer,
    },
  });

export const store = setupStore();

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

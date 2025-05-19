import { configureStore, Store } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import appReducer from '@helpers/reducers/appReducer';
import { APIRequestState } from '@helpers/types/state';

declare global {
  interface Window {
    store: Store<RootState>;
    Cypress: {
      env: (key: string) => string;
      log: (message: string) => void;
      [key: string]: unknown;
    };
  }
}

export type RootState = {
  [x: string]: any;
  app: {
    isMobileNavbarActive: boolean;
    language: string;
    isLoggedIn: boolean;
    lastVisitedURL: string;
    selectedLanguage: string;
  };
};

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const store = configureStore({
  reducer: {
    app: appReducer,
  },
});
if (window.Cypress) {
  window.store = store as unknown as Store<RootState>;
}

export default store;

import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';

import i18n from '@base/i18n';
import { useAppDispatch, useAppSelector } from '@base/store';
import Topbar from '@components/topbar/Topbar';
import { UserProvider, useUser } from '@contexts/UserContext';
import { PageURLs } from '@helpers/enums/enums';
import { setLastVisitedURL } from '@helpers/reducers/appReducer';
import { selectLanguage } from '@helpers/selectors/appSelector';
import { changeLanguage } from '@helpers/translationTool';
import ProtectedRoute from '@helpers/utils/protectedRoute';
import BookExchange from '@pages/BookExchange';
import BookRegister from '@pages/BookRegister';
import Home from '@pages/Home';
import KakaoCallback from '@pages/KakaoCallback';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import WildCard from '@pages/WildCard';

import BookExchangeRequest from './pages/BookExchangeRequest';

function AppContent() {
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const selectedLanguage = useAppSelector(selectLanguage);
  const location = useLocation();
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['']);
  const { pathname } = useLocation();

  useEffect(() => {
    const supportedLngs = i18n.options.supportedLngs ? i18n.options.supportedLngs : [''];
    const supportedLanguages = supportedLngs.filter((lang: string) => lang !== 'cimode');

    setAvailableLanguages(supportedLanguages);
  }, [dispatch]);

  useEffect(() => {
    const langExists = availableLanguages.includes(selectedLanguage);
    const correctLanguage = langExists ? selectedLanguage : i18n.languages[1];

    changeLanguage(correctLanguage);
  }, [selectedLanguage, availableLanguages]);

  useEffect(() => {
    if (user) {
      dispatch(setLastVisitedURL(pathname || ''));
    }
  }, [pathname, user, dispatch]);

  return (
    <Grid
      container
      direction="column"
      className="app-container"
      position="relative"
    >
      {user && location.pathname !== '/login' && !location.pathname.startsWith('/book/') ? <Topbar /> : null}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute
              isProtected={!!user}
              component={<Home />}
            />
          }
        />
        <Route
          path={PageURLs.BOOK_EXCHANGE}
          element={
            <ProtectedRoute
              isProtected={!!user}
              component={<BookExchange />}
            />
          }
        />
        <Route
          path="/book-register"
          element={
            <ProtectedRoute
              isProtected={!!user}
              component={<BookRegister />}
            />
          }
        />
        <Route
          path={`${PageURLs.PROFILE}/:userId`}
          element={
            <ProtectedRoute
              isProtected={!!user}
              component={<Profile />}
            />
          }
        />
        <Route
          path={PageURLs.WILD_CARD}
          element={<WildCard />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/oauth/callback/kakao"
          element={<KakaoCallback />}
        />
        <Route
          path="/exchange-request"
          element={<BookExchangeRequest />}
        />
      </Routes>
    </Grid>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;

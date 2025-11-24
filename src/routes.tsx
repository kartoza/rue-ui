import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MapPage from './pages/Map';
import Page from './pages/Page';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import React from 'react';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Page title="Home">
            <Home />
          </Page>
        }
      />
      <Route
        path="/login"
        element={
          <Page title="Login">
            <Login />
          </Page>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <Page title="Map">
              <MapPage />
            </Page>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

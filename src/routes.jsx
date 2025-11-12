// src/routes.tsx
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import MapPage from './pages/Map/Map';
import Page from './pages/Page';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const AppRoutes = () => {
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

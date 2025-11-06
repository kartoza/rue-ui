// src/routes.tsx
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import MapPage from './pages/Map/Map';
import Page from './pages/Page';

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
        path="/about"
        element={
          <Page title="About">
            <About />
          </Page>
        }
      />

      <Route
        path="/map"
        element={
          <Page title="Map">
            <MapPage />
          </Page>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

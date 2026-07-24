import { Route, Routes } from 'react-router-dom';

import { AppLayout } from './layout/AppLayout';
import { ArenaPage } from './pages/ArenaPage';
import { LandingPage } from './pages/LandingPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ProblemsPage } from './pages/ProblemsPage';

export const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/problems" element={<ProblemsPage />} />
      <Route path="/arena" element={<ArenaPage />} />
    </Route>
  </Routes>
);

import { Outlet } from 'react-router-dom';

import { Navbar } from '../components/navigation/Navbar';

export const AppLayout = () => (
  <div className="app-shell">
    <Navbar />
    <main>
      <Outlet />
    </main>
  </div>
);

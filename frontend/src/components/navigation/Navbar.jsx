import { Menu, Swords } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { label: 'Problems', to: '/problems' },
  { label: 'Arena', to: '/arena' },
];

export const Navbar = () => (
  <header className="site-header">
    <nav className="site-nav container" aria-label="Main navigation">
      <NavLink className="brand" to="/" aria-label="Code Golf Arena home">
        <span className="brand-mark"><Swords size={19} strokeWidth={2.5} /></span>
        <span>Code Golf <strong>Arena</strong></span>
      </NavLink>

      <div className="nav-links">
        {navigation.map(({ label, to }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {label}
          </NavLink>
        ))}
      </div>

      <div className="nav-actions">
        <NavLink className="button button-ghost nav-sign-in" to="/arena">Enter Arena</NavLink>
        <button className="mobile-menu-button" type="button" aria-label="Open navigation"><Menu size={21} /></button>
      </div>
    </nav>
  </header>
);

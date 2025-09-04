// src/components/Navigation.jsx
import { Link, useLocation } from 'react-router-dom'

const Navigation = ({ onLogout }) => {
  const location = useLocation()
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  }
  
  return (
    <nav className="navigation">
      <div className="nav-brand">URL Shortener</div>
      <div className="nav-links">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
        >
          Shorten URL
        </Link>
        <Link 
          to="/stats" 
          className={location.pathname === '/stats' ? 'nav-link active' : 'nav-link'}
        >
          Statistics
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navigation
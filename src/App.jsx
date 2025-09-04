// src/App.jsx
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UrlShortener from './components/UrlShortener.jsx'
import Statistics from './components/Statistics.jsx'
import Navigation from './components/Navigation.jsx'
import Login from './components/Login.jsx'
import LoggingMiddleware from './components/loggingmiddleware.js'
import { AuthService } from './services/authService.js'
import './App.css'

function App() {
  const [urls, setUrls] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthentication();
    loadUrls();
  }, [])

  const checkAuthentication = () => {
    const authenticated = AuthService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setLoading(false);
    
    if (authenticated) {
      LoggingMiddleware.info('auth', 'User authenticated successfully');
    } else {
      LoggingMiddleware.warn('auth', 'User not authenticated');
    }
  }

  const loadUrls = () => {
    const savedUrls = JSON.parse(localStorage.getItem('shortenedUrls')) || []
    setUrls(savedUrls)
    LoggingMiddleware.info('storage', `Loaded ${savedUrls.length} URLs from storage`)
  }

  const updateUrls = (newUrls) => {
    setUrls(newUrls)
    localStorage.setItem('shortenedUrls', JSON.stringify(newUrls))
    LoggingMiddleware.info('storage', `Updated storage with ${newUrls.length} URLs`)
  }

  const handleLogin = async (authData) => {
    try {
      setLoading(true);
      await AuthService.authenticate(authData);
      setIsAuthenticated(true);
      LoggingMiddleware.info('auth', 'User logged in successfully');
    } catch (error) {
      LoggingMiddleware.error('auth', `Login failed: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    LoggingMiddleware.info('auth', 'User logged out');
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <Navigation onLogout={handleLogout} />
        <Routes>
          <Route 
            path="/" 
            element={
              <UrlShortener 
                urls={urls} 
                setUrls={updateUrls} 
              />
            } 
          />
          <Route 
            path="/stats" 
            element={
              <Statistics 
                urls={urls} 
              />
            } 
          />
          <Route path="/:shortCode" element={<RedirectHandler urls={urls} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

// Component to handle redirection
const RedirectHandler = ({ urls }) => {
  const shortCode = window.location.pathname.substring(1)
  const urlData = urls.find(url => url.shortCode === shortCode)
  
  useEffect(() => {
    if (urlData) {
      const clickData = {
        timestamp: new Date().toISOString(),
        source: 'direct',
        location: 'Unknown'
      }
      
      const updatedUrls = urls.map(url => {
        if (url.shortCode === shortCode) {
          return {
            ...url,
            clicks: url.clicks + 1,
            clickData: [...url.clickData, clickData]
          }
        }
        return url
      })
      
      localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls))
      LoggingMiddleware.info('redirect', `Redirecting from /${shortCode} to ${urlData.longUrl}`)
      window.location.href = urlData.longUrl
    }
  }, [urlData, shortCode, urls])
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      {urlData ? 'Redirecting...' : 'Short URL not found'}
    </div>
  )
}

export default App
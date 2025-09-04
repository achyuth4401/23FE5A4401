// src/components/Login.jsx
import { useState } from 'react'
import LoggingMiddleware from './loggingmiddleware.js'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    rollNo: '',
    accessCode: '',
    clientID: '',
    clientSecret: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await onLogin(formData)
      LoggingMiddleware.info('auth', 'Login form submitted successfully')
    } catch (error) {
      setError(error.message)
      LoggingMiddleware.error('auth', `Login failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Authentication Required</h2>
        <p>Please enter your evaluation credentials</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Roll Number:</label>
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Access Code:</label>
            <input
              type="text"
              name="accessCode"
              value={formData.accessCode}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Client ID:</label>
            <input
              type="text"
              name="clientID"
              value={formData.clientID}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Client Secret:</label>
            <input
              type="password"
              name="clientSecret"
              value={formData.clientSecret}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
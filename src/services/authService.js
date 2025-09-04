// src/services/authService.js
export class AuthService {
  static async register(registrationData) {
    try {
      const response = await fetch('http://20.244.56.144/evaluation-service/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async authenticate(authData) {
    try {
      const response = await fetch('http://20.244.56.144/evaluation-service/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData)
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const result = await response.json();
      localStorage.setItem('authData', JSON.stringify(result));
      return result;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  static getToken() {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    return authData.access_token;
  }

  static isAuthenticated() {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    return !!authData.access_token;
  }

  static logout() {
    localStorage.removeItem('authData');
  }
}
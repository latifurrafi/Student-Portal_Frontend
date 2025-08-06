// Authentication Service for JWT Token Management

const API_BASE_URL = '/students/login'; // Using relative path for proxy

class AuthService {
  // Store JWT token in localStorage
  setToken(token) {
    localStorage.setItem('jwt_token', token);
  }

  // Get JWT token from localStorage
  getToken() {
    return localStorage.getItem('jwt_token');
  }

  // Remove JWT token from localStorage
  removeToken() {
    localStorage.removeItem('jwt_token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // For simple session token
      const sessionData = JSON.parse(atob(token));
      // Check if session is not too old (24 hours)
      const currentTime = Date.now();
      const sessionAge = currentTime - sessionData.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge > maxAge) {
        this.removeToken();
        return false;
      }
      
      return true;
    } catch (error) {
      // Try JWT token format as fallback
    try {
      const payload = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
      } catch (jwtError) {
      this.removeToken();
      return false;
      }
    }
  }

  // Decode JWT token (without verification - for client-side expiry check)
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Get user info from token
  getUserInfo() {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      // For simple session token
      const sessionData = JSON.parse(atob(token));
      return {
        studentId: sessionData.studentId,
        // Add other user fields as needed
      };
    } catch (error) {
      // Try JWT token format as fallback
      try {
        const payload = this.decodeToken(token);
        return {
          studentId: payload.studentId || payload.sub,
          name: payload.name,
          email: payload.email,
          department: payload.department,
          // Add other user fields as needed
        };
      } catch (jwtError) {
      return null;
      }
    }
  }

  // Login with student ID and password
  async login(studentId, password) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: parseInt(studentId),
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(errorData.error || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      
      // For now, since your backend doesn't return a token, we'll create a simple session
      // In a real app, your backend should return a JWT token
      if (data.message === 'Login successful') {
        // Create a simple session token for demo purposes
        const sessionToken = btoa(JSON.stringify({
          studentId: studentId,
          timestamp: Date.now()
        }));
        this.setToken(sessionToken);
      } else {
        throw new Error('Login response not recognized');
      }
      
      return {
        success: true,
        user: this.getUserInfo(),
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed. Please try again.'
      };
    }
  }

  // Logout
  logout() {
    this.removeToken();
    // You can also call a logout API endpoint here if needed
    // await fetch(`${API_BASE_URL}/auth/logout`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.getToken()}`
    //   }
    // });
  }

  // Refresh token (if your API supports it)
  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      this.setToken(data.token);
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // Get authorization header for API calls
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Make authenticated API calls
  async authenticatedRequest(url, options = {}) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    // Handle token expiration
    if (response.status === 401) {
      // Try to refresh token
      const refreshSuccess = await this.refreshToken();
      if (!refreshSuccess) {
        this.logout();
        throw new Error('Session expired. Please login again.');
      }
      
      // Retry the request with new token
      return this.authenticatedRequest(url, options);
    }

    return response;
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService; 
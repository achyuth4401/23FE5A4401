// src/components/LoggingMiddleware.js
class Loggingmiddleware {
  static async log(stack, level, packageName, message) {
    const timestamp = new Date().toISOString();
    
    // Log to console first
    console.log(`[${level.toUpperCase()}] ${timestamp}: ${message}`, {
      stack,
      package: packageName
    });

    try {
      // Get auth token from localStorage
      const authData = JSON.parse(localStorage.getItem('authData') || '{}');
      const token = authData.access_token;

      if (!token) {
        console.warn('No auth token available for logging');
        return;
      }

      // Prepare log data according to API constraints
      const logData = {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: packageName.toLowerCase(),
        message: message.substring(0, 500) // Limit message length
      };

      // Make API call to evaluation service
      const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(logData)
      });

      if (!response.ok) {
        throw new Error(`Log API failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Log created successfully:', result.logID);

    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  // Convenience methods for different log levels
  static async debug(packageName, message) {
    await this.log('frontend', 'debug', packageName, message);
  }

  static async info(packageName, message) {
    await this.log('frontend', 'info', packageName, message);
  }

  static async warn(packageName, message) {
    await this.log('frontend', 'warn', packageName, message);
  }

  static async error(packageName, message) {
    await this.log('frontend', 'error', packageName, message);
  }

  static async fatal(packageName, message) {
    await this.log('frontend', 'fatal', packageName, message);
  }
}

export default Loggingmiddleware;
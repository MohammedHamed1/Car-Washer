const axios = require('axios');
const FRONTEND_CONFIG = require('./frontend-config');

class FrontendConnector {
  constructor() {
    this.backendUrl = FRONTEND_CONFIG.backend.local;
    this.frontendUrl = FRONTEND_CONFIG.local;
  }

  // Test backend connection
  async testBackendConnection() {
    try {
      console.log('🔍 Testing backend connection...');
      const response = await axios.get(`${this.backendUrl}/api/test`);
      console.log('✅ Backend connection successful:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Backend connection failed:', error.message);
      return false;
    }
  }

  // Test frontend connection
  async testFrontendConnection() {
    try {
      console.log('🔍 Testing frontend connection...');
      const response = await axios.get(this.frontendUrl);
      console.log('✅ Frontend connection successful');
      return true;
    } catch (error) {
      console.log('⚠️ Frontend not running on', this.frontendUrl);
      return false;
    }
  }

  // Get connection status
  async getConnectionStatus() {
    const backendStatus = await this.testBackendConnection();
    const frontendStatus = await this.testFrontendConnection();

    return {
      backend: {
        url: this.backendUrl,
        status: backendStatus ? 'connected' : 'disconnected'
      },
      frontend: {
        url: this.frontendUrl,
        status: frontendStatus ? 'connected' : 'disconnected'
      },
      timestamp: new Date().toISOString()
    };
  }

  // Open both applications
  openApplications() {
    const { exec } = require('child_process');
    
    console.log('🌐 Opening applications...');
    
    // Open backend
    exec(`start ${this.backendUrl}`, (error) => {
      if (error) console.error('Error opening backend:', error);
      else console.log('✅ Backend opened:', this.backendUrl);
    });

    // Open frontend
    exec(`start ${this.frontendUrl}`, (error) => {
      if (error) console.error('Error opening frontend:', error);
      else console.log('✅ Frontend opened:', this.frontendUrl);
    });
  }
}

module.exports = FrontendConnector; 
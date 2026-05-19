/**
 * API Configuration for Backend Integration
 */

interface ApiConfig {
  BASE_URL: string;
  API_PREFIX: string;
  TIMEOUT: number;
  readonly API_URL: string;
}

const API_CONFIG: ApiConfig = {
  // Backend base URL
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3000",
  
  // API prefix (mounted in backend app.js)
  API_PREFIX: "/eco-market",
  
  // Request timeout (30 seconds)
  TIMEOUT: 30000,
  
  // Full API URL
  get API_URL(): string {
    return `${this.BASE_URL}${this.API_PREFIX}`;
  },
};

export default API_CONFIG;

import axios from 'axios';

const BACKEND_API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:2000/eco-market';

class LocationService {
  constructor() {
    this.api = axios.create({
      baseURL: BACKEND_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Add auth interceptor
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Cache để tránh gọi API nhiều lần
    this.cache = new Map();
  }

  /**
   * Lấy danh sách tỉnh/thành phố
   */
  async getProvinces() {
    const cacheKey = 'provinces';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await this.api.get('/location/provinces');
      
      if (response.data.success) {
        const provinces = response.data.data;
        this.cache.set(cacheKey, provinces);
        return provinces;
      } else {
        throw new Error(response.data.message || 'Failed to fetch provinces');
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw new Error('Không thể lấy danh sách tỉnh/thành phố');
    }
  }

  /**
   * Lấy danh sách quận/huyện theo tỉnh
   */
  async getDistricts(provinceId) {
    if (!provinceId) {
      throw new Error('Province ID is required');
    }

    const cacheKey = `districts_${provinceId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await this.api.get(`/location/districts/${provinceId}`);
      
      if (response.data.success) {
        const districts = response.data.data;
        this.cache.set(cacheKey, districts);
        return districts;
      } else {
        throw new Error(response.data.message || 'Failed to fetch districts');
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw new Error('Không thể lấy danh sách quận/huyện');
    }
  }

  /**
   * Lấy danh sách phường/xã theo quận/huyện
   */
  async getWards(districtId) {
    if (!districtId) {
      throw new Error('District ID is required');
    }

    const cacheKey = `wards_${districtId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await this.api.get(`/location/wards/${districtId}`);
      
      if (response.data.success) {
        const wards = response.data.data;
        this.cache.set(cacheKey, wards);
        return wards;
      } else {
        throw new Error(response.data.message || 'Failed to fetch wards');
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw new Error('Không thể lấy danh sách phường/xã');
    }
  }

  /**
   * Lấy location hierarchy (tỉnh > huyện > xã)
   */
  async getLocationHierarchy(provinceId = null, districtId = null) {
    try {
      const params = {};
      if (provinceId) params.provinceId = provinceId;
      if (districtId) params.districtId = districtId;

      const response = await this.api.get('/location/hierarchy', { params });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch location hierarchy');
      }
    } catch (error) {
      console.error('Error fetching location hierarchy:', error);
      throw new Error('Không thể lấy dữ liệu địa điểm');
    }
  }

  /**
   * Convert địa chỉ text thành IDs
   */
  async convertAddressToIds(address) {
    try {
      const response = await this.api.post('/location/convert', {
        province: address.province,
        district: address.district,
        ward: address.ward
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to convert address');
      }
    } catch (error) {
      console.error('Error converting address:', error);
      throw new Error('Không thể convert địa chỉ sang ID');
    }
  }

  /**
   * Validate địa chỉ với shipping provider
   */
  async validateAddress(address) {
    try {
      const response = await this.api.post('/location/validate', {
        provinceId: address.provinceId,
        districtId: address.districtId,
        wardCode: address.wardCode
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to validate address');
      }
    } catch (error) {
      console.error('Error validating address:', error);
      throw new Error('Không thể validate địa chỉ');
    }
  }

  /**
   * Search địa điểm theo tên
   */
  async searchLocation(query, type = null) {
    try {
      const params = { query };
      if (type) params.type = type;

      const response = await this.api.get('/location/search', { params });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to search location');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      throw new Error('Không thể tìm kiếm địa điểm');
    }
  }

  /**
   * Tìm tỉnh theo tên
   */
  async findProvinceByName(provinceName) {
    try {
      const provinces = await this.getProvinces();
      return provinces.find(p => 
        this.normalizeString(p.name) === this.normalizeString(provinceName)
      );
    } catch (error) {
      console.error('Error finding province by name:', error);
      return null;
    }
  }

  /**
   * Tìm quận/huyện theo tên và tỉnh
   */
  async findDistrictByName(provinceId, districtName) {
    try {
      const districts = await this.getDistricts(provinceId);
      return districts.find(d => 
        this.normalizeString(d.name) === this.normalizeString(districtName)
      );
    } catch (error) {
      console.error('Error finding district by name:', error);
      return null;
    }
  }

  /**
   * Tìm phường/xã theo tên và quận/huyện
   */
  async findWardByName(districtId, wardName) {
    try {
      const wards = await this.getWards(districtId);
      return wards.find(w => 
        this.normalizeString(w.name) === this.normalizeString(wardName)
      );
    } catch (error) {
      console.error('Error finding ward by name:', error);
      return null;
    }
  }

  /**
   * Normalize string để so sánh
   */
  normalizeString(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  }

  /**
   * Format địa chỉ đầy đủ
   */
  formatFullAddress(address) {
    const parts = [];
    
    if (address.specificAddress) parts.push(address.specificAddress);
    if (address.ward) parts.push(address.ward);
    if (address.district) parts.push(address.district);
    if (address.province) parts.push(address.province);
    
    return parts.join(', ');
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cached data info
   */
  getCacheInfo() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Preload common data
   */
  async preloadData() {
    try {
      // Preload provinces
      await this.getProvinces();
      
      // Preload districts for major cities
      const majorCities = [202, 201, 269]; // HCM, Hanoi, Danang
      await Promise.all(
        majorCities.map(provinceId => this.getDistricts(provinceId))
      );
      
      console.log('Location data preloaded successfully');
    } catch (error) {
      console.error('Error preloading location data:', error);
    }
  }
}

export const locationService = new LocationService();
export default LocationService; 